import type { EventName, EventProps } from '@ghostwriter/shared';
import { api } from '../api/client';

export interface AnalyticsEvent {
  event_name: string;
  anonymous_id: string | null;
  session_id: string;
  properties: Record<string, unknown>;
  url_path: string;
  referrer: string | null;
  utm?: {
    source?: string | null;
    medium?: string | null;
    campaign?: string | null;
    term?: string | null;
    content?: string | null;
  } | null;
  occurred_at: string;
}

const queue: AnalyticsEvent[] = [];
let flushTimeout: number | null = null;
let clientErrorCount = 0;

// Read consent from localStorage
function readConsent() {
  try {
    const raw = localStorage.getItem('gw_consent');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.categories || { essential: true, functional: false, analytics: false };
    }
  } catch (e) {
    // Ignore
  }
  return { essential: true, functional: false, analytics: false };
}

// Generate or retrieve anonymous ID (stored in localStorage)
export function getAnonymousId(): string | null {
  const consent = readConsent();
  if (!consent.analytics) return null;

  let anonId = localStorage.getItem('gw_anonymous_id');
  if (!anonId) {
    anonId = crypto.randomUUID();
    localStorage.setItem('gw_anonymous_id', anonId);
  }
  return anonId;
}

// Clear anonymous ID if consent is revoked
export function deleteAnonymousId() {
  localStorage.removeItem('gw_anonymous_id');
}

// Retrieve or create session ID (stored in sessionStorage)
function getSessionId(): string {
  let sessId = sessionStorage.getItem('gw_session_id');
  if (!sessId) {
    sessId = crypto.randomUUID();
    sessionStorage.setItem('gw_session_id', sessId);
  }
  return sessId;
}

// Read first-touch UTM from sessionStorage
export function readFirstTouchUtm() {
  try {
    const raw = sessionStorage.getItem('gw_utm');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore
  }
  return null;
}

// Snapshot UTM on marketing mount if query params present
export function snapshotUtm() {
  if (sessionStorage.getItem('gw_utm')) return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');

  if (utmSource || utmMedium || utmCampaign) {
    const snapshot = {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
    };
    sessionStorage.setItem('gw_utm', JSON.stringify(snapshot));
  }
}

// Flush the event queue
async function flush() {
  if (queue.length === 0) return;

  const batch = queue.splice(0, 50);
  try {
    // Send batch payload
    await api('/api/analytics/events', {
      method: 'POST',
      body: { events: batch },
    });
  } catch (e) {
    // Put them back in queue if failed
    queue.unshift(...batch);
  }
}

function scheduleFlush() {
  if (queue.length >= 20) {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    flush();
    return;
  }

  if (!flushTimeout) {
    flushTimeout = window.setTimeout(() => {
      flushTimeout = null;
      flush();
    }, 5000);
  }
}

// Global window event listener to flush queue on close / tab hide
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && queue.length > 0) {
      const batch = queue.splice(0, queue.length);
      const url = new URL('/api/analytics/events', window.location.origin);
      navigator.sendBeacon(url.toString(), JSON.stringify({ events: batch }));
    }
  });
}

export function track<N extends EventName>(name: N, props?: EventProps<N>) {
  const consent = readConsent();
  const essential = name === 'client_error' || name === 'web_vital';

  if (!consent.analytics && !essential) {
    return; // Hard gate - no processing before consent
  }

  if (name === 'client_error') {
    clientErrorCount++;
    if (clientErrorCount > 10) return; // Cap client errors to 10/session
  }

  queue.push({
    event_name: name,
    anonymous_id: getAnonymousId(),
    session_id: getSessionId(),
    properties: (props || {}) as Record<string, unknown>,
    url_path: window.location.pathname,
    referrer: document.referrer || null,
    utm: readFirstTouchUtm(),
    occurred_at: new Date().toISOString(),
  });

  scheduleFlush();
}
