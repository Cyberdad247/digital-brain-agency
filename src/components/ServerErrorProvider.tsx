'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '../hooks/use-toast';

const DynamicErrorBoundary = dynamic(() => import('./ServerErrorBoundary').then(mod => ({ default: mod.ServerErrorBoundary })), {
  ssr: true,
  loading: () => <div>Initializing server error boundary...</div>
});

type ErrorState = {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

type ErrorAction =
  | { type: 'SET_ERROR'; payload: { error: Error; errorInfo: React.ErrorInfo } }
  | { type: 'CLEAR_ERROR' };

const initialState: ErrorState = {
  error: null,
  errorInfo: null,
};

const ServerErrorContext = createContext<{
  state: ErrorState;
  dispatch: React.Dispatch<ErrorAction>;
}>({ state: initialState, dispatch: () => null });

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        error: action.payload.error,
        errorInfo: action.payload.errorInfo,
      };
    case 'CLEAR_ERROR':
      return initialState;
    default:
      return state;
  }
};

export const ServerErrorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    dispatch({
      type: 'SET_ERROR',
      payload: { error, errorInfo },
    });
    toast({
      title: 'Server Error',
      description: error.message,
      variant: 'destructive',
    });
  }, []);

  return (
    <DynamicErrorBoundary
      fallback={
        <div className="p-4 rounded-md bg-destructive/15 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Server-side error occurred</h2>
          <p className="text-sm mb-4">{state.error?.message}</p>
          {state.errorInfo && (
            <pre className="text-xs overflow-auto p-2 bg-background/50 rounded">
              {state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      }
      onError={handleError}
    >
      <ServerErrorContext.Provider value={{ state, dispatch }}>{children}</ServerErrorContext.Provider>
    </DynamicErrorBoundary>
  );
};

export const useServerError = () => {
  const context = useContext(ServerErrorContext);
  if (!context) {
    throw new Error('useServerError must be used within a ServerErrorProvider');
  }
  return {
    error: context.state.error,
    errorInfo: context.state.errorInfo,
    clearError: () => context.dispatch({ type: 'CLEAR_ERROR' }),
    setError: (error: Error, errorInfo: React.ErrorInfo) =>
      context.dispatch({
        type: 'SET_ERROR',
        payload: { error, errorInfo },
      }),
  };
};