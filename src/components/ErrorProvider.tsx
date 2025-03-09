'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { toast } from '../hooks/use-toast';
import { ErrorAnalyticsService } from '../lib/error/ErrorAnalyticsService';
import { debugSymbol } from '../lib/error/debugSymbols';

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

const ErrorContext = createContext<{
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

/**
 * 🌐 ERROR PROVIDER
 * @description Global error boundary provider with debug symbol integration
 */
export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Register debug symbol for error boundary
  debugSymbol('⚠️');

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Error caught by ErrorProvider:', error);
        console.error('Component stack:', errorInfo.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
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
