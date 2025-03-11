'use client';

import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { InspiraErrorHandler } from '@/lib/error/InspiraErrorHandler';
import ErrorFallback from './ErrorFallback';

interface InspiraErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetCondition?: unknown;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  enhancedError?: {
    optimizedMessage: string;
    symbolicRepresentation: string;
    category: string;
    severity: string;
    suggestions: string[];
  };
}

/**
 * Inspira Error Boundary
 * 
 * An enhanced error boundary that leverages the Inspira staff personas to provide
 * better error messages, categorization, and debugging suggestions.
 */
export class InspiraErrorBoundary extends React.Component<InspiraErrorBoundaryProps, State> {
  private inspiraHandler: InspiraErrorHandler;

  constructor(props: InspiraErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      enhancedError: undefined,
    };
    this.inspiraHandler = InspiraErrorHandler.getInstance();
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.processError(error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private async processError(error: Error, errorInfo: React.ErrorInfo): Promise<void> {
    try {
      // Use Inspira staff capabilities to enhance error information
      const enhancedError = await this.inspiraHandler.handleError(
        error, 
        this.props.context || 'client',
        {
          componentStack: errorInfo.componentStack,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          url: typeof window !== 'undefined' ? window.location.href : '',
        }
      );

      // Update state with enhanced error information
      this.setState({
        enhancedError: {
          optimizedMessage: enhancedError.optimizedMessage,
          symbolicRepresentation: enhancedError.symbolicRepresentation,
          category: enhancedError.category,
          severity: enhancedError.severity,
          suggestions: enhancedError.suggestions,
        },
      });
    } catch (processingError) {
      console.error('Error processing with Inspira staff:', processingError);
    }
  }

  componentDidUpdate(prevProps: InspiraErrorBoundaryProps) {
    if (
      this.state.hasError &&
      prevProps.resetCondition !== this.props.resetCondition
    ) {
      this.handleReset();
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      enhancedError: undefined,
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
          enhancedError={this.state.enhancedError}
        />
      );
    }

    return this.props.children;
  }
}