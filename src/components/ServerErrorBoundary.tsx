'use client';

import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { ErrorMonitoringService } from '../lib/error/ErrorMonitoringService';
import { toast } from '../hooks/use-toast';

interface ServerErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Server-side error boundary component specifically designed for Next.js.
 * Handles server-side runtime errors and provides fallback UI with recovery options.
 */
export class ServerErrorBoundary extends BaseErrorBoundary {
  private errorMonitor: ErrorMonitoringService;

  constructor(props: ServerErrorBoundaryProps) {
    super(props);
    this.errorMonitor = ErrorMonitoringService.getInstance();
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.logError(error, errorInfo);
    toast({
      title: 'Server Error',
      description: error.message,
      variant: 'destructive',
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 mx-auto max-w-2xl bg-destructive/10 rounded-lg shadow-lg">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-destructive">Server Error</h2>
            <div className="bg-background/50 p-4 rounded border border-destructive/20">
              <p className="text-sm font-mono text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
