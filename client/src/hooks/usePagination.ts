import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function usePagination(paramName = 'page', perPage = 20) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const pageStr = searchParams.get(paramName);
  const page = pageStr ? parseInt(pageStr, 10) || 1 : 1;

  const setPage = useCallback((newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete(paramName);
      } else {
        next.set(paramName, String(newPage));
      }
      return next;
    }, { replace: false });
  }, [paramName, setSearchParams]);

  return {
    page,
    setPage,
    perPage,
  };
}
export default usePagination;
