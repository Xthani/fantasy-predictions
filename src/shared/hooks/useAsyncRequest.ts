import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncRequestStatus = 'loading' | 'error' | 'success';

type UseAsyncRequestOptions<T> = {
  request: () => Promise<T>;
  mapError: (error: unknown) => string;
  onSuccess?: (data: T) => void;
};

export const useAsyncRequest = <T>({ request, mapError, onSuccess }: UseAsyncRequestOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncRequestStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const result = await request();
        if (cancelled) return;

        setData(result);
        setError(null);
        setStatus('success');
        onSuccessRef.current?.(result);
      } catch (requestError) {
        if (cancelled) return;
        setError(mapError(requestError));
        setStatus('error');
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [reloadToken, request, mapError]);

  const retry = useCallback(() => {
    setStatus('loading');
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  return {
    data,
    status,
    error,
    retry,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
};
