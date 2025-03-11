'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ErrorMonitoringService } from '@/lib/error/ErrorMonitoringService';
import { useEffect } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  reset?: () => void;
}

/**
 * Enhanced error fallback component that provides a user-friendly error display
 * with detailed information in development mode and recovery options.
 */
export default function ErrorFallback({ error, resetErrorBoundary, reset }: ErrorFallbackProps) {
  const router = useRouter();
  const errorMonitor = ErrorMonitoringService.getInstance();
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log the error to our monitoring service
  useEffect(() => {
    errorMonitor.captureError(error, {
      ...errorMonitor.getBrowserErrorMetadata(),
      additionalInfo: {
        component: 'ErrorFallback',
        recoveryAttempted: false
      }
    });
  }, [error, errorMonitor]);

  const handleReset = () => {
    // Track recovery attempt
    errorMonitor.captureInfo('User attempted error recovery', {
      additionalInfo: {
        errorMessage: error.message,
        component: 'ErrorFallback',
        recoveryAttempted: true
      }
    });
    
    // Use the provided reset function or resetErrorBoundary
    if (reset) {
      reset();
    } else if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-destructive/20">
        <CardHeader className="bg-destructive/5 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-destructive">Something went wrong</CardTitle>
          <CardDescription>
            We've encountered an unexpected error. Our team has been notified.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2">
          <div className="space-y-4">
            <p className="text-sm font-medium">{error.message || 'An unknown error occurred'}</p>
            
            {isDevelopment && error.stack && (
              <div className="mt-4 overflow-auto max-h-[200px] rounded bg-muted p-2">
                <pre className="text-xs font-mono whitespace-pre-wrap break-words text-muted-foreground">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant="default" 
            onClick={handleReset} 
            className="w-full sm:w-auto"
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGoHome}
            className="w-full sm:w-auto"
          >
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}