'use client';

import React from 'react';
import { ErrorMonitoringService } from '../lib/error/ErrorMonitoringService';
import ErrorFallback from './ErrorFallback';

interface BaseErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetCondition?: unknown;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Base error boundary component that provides core error handling functionality.
 * This component serves as the foundation for both client and server-side error boundaries.
 */
export class BaseErrorBoundary extends React.Component<BaseErrorBoundaryProps, State> {
  private errorMonitor: ErrorMonitoringService;

  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
    this.errorMonitor = ErrorMonitoringService.getInstance();
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  protected async logError(error: Error, errorInfo: React.ErrorInfo): Promise<void> {
    try {
      await this.errorMonitor.captureError(error, {
        componentStack: errorInfo.componentStack,
        ...this.errorMonitor.getBrowserErrorMetadata()
      });
    } catch (logError) {
      console.error('Error during logging:', logError);
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.logError(error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: BaseErrorBoundaryProps) {
    if (
      this.state.hasError &&
      prevProps.resetCondition !== this.props.resetCondition
    ) {
      this.handleReset();
    }
  }

  protected handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error || new Error('Unknown error occurred')}
          resetErrorBoundary={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}