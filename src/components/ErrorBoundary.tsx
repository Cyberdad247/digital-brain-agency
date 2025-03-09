'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ErrorBoundary = ({ children, fallback, onError }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
      if (onError) {
        onError(error, { componentStack: '' });
      }
    }
  }, [error, onError]);

  if (hasError) {
    return fallback;
  }

  try {
    return children;
  } catch (e) {
    setError(e instanceof Error ? e : new Error(String(e)));
    setHasError(true);
    return fallback;
  }
};

export default ErrorBoundary;
