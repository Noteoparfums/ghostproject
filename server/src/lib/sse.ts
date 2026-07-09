import type { Response } from 'express';

export interface SseHandle {
  send: (event: string, data: unknown) => void;
  close: () => void;
  res: Response;
}

const streams = new Map<number, { abort: AbortController; handle: SseHandle }>();

export function openSse(res: Response): SseHandle {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(': connected\n\n');
  const handle: SseHandle = {
    send(event, data) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
    close() {
      try {
        res.end();
      } catch {
        /* ignore */
      }
    },
    res,
  };
  return handle;
}

export const sseRegistry = {
  register(generationId: number, abort: AbortController, handle: SseHandle) {
    streams.set(generationId, { abort, handle });
  },
  unregister(generationId: number) {
    streams.delete(generationId);
  },
  abort(generationId: number) {
    const s = streams.get(generationId);
    if (s) s.abort.abort();
  },
  count() {
    return streams.size;
  },
  broadcastError(code: string) {
    for (const { handle } of streams.values()) {
      handle.send('error', { code, message: 'Server restarting', refunded: true });
      handle.close();
    }
  },
};
