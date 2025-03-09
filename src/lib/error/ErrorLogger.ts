'use client';

import { toast } from '../../hooks/use-toast';

interface ErrorLogData {
  error: string;
  componentStack?: string;
  timestamp: string;
  location: string;
  userAgent: string;
  environment: string;
  version: string;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private readonly isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public async logError(error: Error, componentStack?: string): Promise<void> {
    const errorData: ErrorLogData = {
      error: error.toString(),
      componentStack,
      timestamp: new Date().toISOString(),
      location: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    };

    if (this.isDevelopment) {
      console.error('Error details:', errorData);
    }

    try {
      await fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      });

      // Show error toast only in development
      if (this.isDevelopment) {
        toast({
          title: 'Error Logged',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (e) {
      console.warn('Failed to send error to logging service:', e);
    }
  }
}
