import { useState, useCallback } from "react";
import { extractErrorMessage } from "./error-handler";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, P = any>(
  apiFunction: (params?: P) => Promise<T>,
  initialData: T | null = null
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (params?: P): Promise<T | null> => {
      try {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));

        const result = await apiFunction(params);

        setState((prevState) => ({
          ...prevState,
          data: result,
          loading: false,
        }));
        return result;
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setState((prevState) => ({
          ...prevState,
          error: errorMessage,
          loading: false,
        }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const clearError = useCallback(() => {
    setState((prevState) => ({ ...prevState, error: null }));
  }, []);

  const setData = useCallback((newData: T | null) => {
    setState((prevState) => ({ ...prevState, data: newData }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
    setData,
  };
}
