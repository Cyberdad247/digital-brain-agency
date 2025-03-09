'use client';

import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';

interface ClientErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Client-side error boundary component specifically designed for React 18 and Next.js.
 * Handles client-side runtime errors and provides fallback UI.
 */
export class ClientErrorBoundary extends BaseErrorBoundary {
  constructor(props: ClientErrorBoundaryProps) {
    super(props);
  }
}
