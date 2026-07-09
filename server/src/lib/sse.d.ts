import type { Response } from 'express';
export interface SseHandle {
    send: (event: string, data: unknown) => void;
    close: () => void;
    res: Response;
}
export declare function openSse(res: Response): SseHandle;
export declare const sseRegistry: {
    register(generationId: number, abort: AbortController, handle: SseHandle): void;
    unregister(generationId: number): void;
    abort(generationId: number): void;
    count(): number;
    getIds(): number[];
    broadcastError(code: string): void;
};
//# sourceMappingURL=sse.d.ts.map