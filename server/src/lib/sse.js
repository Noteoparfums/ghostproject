const streams = new Map();
export function openSse(res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.write(': connected\n\n');
    const handle = {
        send(event, data) {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        },
        close() {
            try {
                res.end();
            }
            catch {
                /* ignore */
            }
        },
        res,
    };
    return handle;
}
export const sseRegistry = {
    register(generationId, abort, handle) {
        streams.set(generationId, { abort, handle });
    },
    unregister(generationId) {
        streams.delete(generationId);
    },
    abort(generationId) {
        const s = streams.get(generationId);
        if (s)
            s.abort.abort();
    },
    count() {
        return streams.size;
    },
    getIds() {
        return Array.from(streams.keys());
    },
    broadcastError(code) {
        for (const { handle } of streams.values()) {
            handle.send('error', { code, message: 'Server restarting', refunded: true });
            handle.close();
        }
    },
};
//# sourceMappingURL=sse.js.map