import { tokens, ApiError } from './client';

export interface SseEvent {
  event: string; // stage_start | token | stage_complete | angle_options | asset_start | asset_complete | queued | done | error
  data: any;
}

export async function streamSse(
  path: string,
  body: unknown,
  onEvent: (e: SseEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const url = new URL(path, window.location.origin);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  };
  
  const access = tokens.getAccess();
  if (access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
    signal,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new ApiError(
      json?.error?.code ?? 'INTERNAL',
      json?.error?.message ?? 'Something went wrong',
      res.status,
      json?.error?.request_id,
      json?.error?.details
    );
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line
      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        
        let event = 'message';
        let data = '';
        
        for (const line of frame.split('\n')) {
          if (line.startsWith('event:')) {
            event = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            data += line.slice(5).trim();
          }
        }
        
        if (data) {
          try {
            onEvent({ event, data: JSON.parse(data) });
          } catch (e) {
            console.error('Failed to parse SSE data', data, e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
