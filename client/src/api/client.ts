import { ERROR_CODES } from '@ghostwriter/shared';

export class ApiError extends Error {
  code: string;
  status: number;
  requestId?: string;
  details?: unknown;

  constructor(
    code: string,
    message: string,
    status: number,
    requestId?: string,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.details = details;
  }
}

type TokenStore = {
  getAccess: () => string | null;
  setAccess: (t: string | null) => void;
};

// In-memory only. Never localStorage.
let accessToken: string | null = null;
export const tokens: TokenStore = {
  getAccess: () => accessToken,
  setAccess: (t) => {
    accessToken = t;
  },
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
  // Deduplicate concurrent refreshes: N parallel 401s → one refresh call.
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      if (!res.ok) return false;
      const body = await res.json();
      tokens.setAccess(body.data.access_token);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  /** internal — prevents infinite refresh loops */
  _retried?: boolean;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = new URL(path, window.location.origin);
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  
  const access = tokens.getAccess();
  if (access) headers.Authorization = `Bearer ${access}`;

  const requestId = crypto.randomUUID();
  headers['X-Request-Id'] = requestId;

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
    signal: opts.signal,
  });

  const responseRequestId = res.headers.get('X-Request-Id') ?? requestId;

  if (res.status === 401 && !opts._retried && !path.startsWith('/api/auth/refresh')) {
    const ok = await refreshOnce();
    if (ok) return api<T>(path, { ...opts, _retried: true });
    // Refresh failed → session expired. AuthContext listens for this event.
    window.dispatchEvent(new CustomEvent('auth:session-expired'));
    throw new ApiError(ERROR_CODES.INVALID_TOKEN, 'Session expired', 401, responseRequestId);
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = json?.error;
    throw new ApiError(
      err?.code ?? 'INTERNAL',
      err?.message ?? 'Something went wrong',
      res.status,
      err?.request_id ?? responseRequestId,
      err?.details,
    );
  }
  
  // Return the contents of 'data' or the full body depending on backend routing convention
  // Check if response has a top-level `data` key
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}
