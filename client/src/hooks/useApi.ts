import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../api/client';

export function useApi<T>(
  apiFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // Abort active execution
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    setError(null);

    try {
      const result = await apiFn(controller.signal);
      if (!controller.signal.aborted) {
        setData(result);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiFn]);

  // Run on deps change
  useEffect(() => {
    execute();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return { data, loading, error, refetch, setData };
}
export default useApi;
