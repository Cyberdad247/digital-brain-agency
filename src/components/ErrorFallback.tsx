'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ErrorCategory, ErrorSeverity } from '@/lib/error/AppError';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  enhancedError?: {
    optimizedMessage?: string;
    symbolicRepresentation?: string;
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    suggestions?: string[];
  };
}

export default function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  enhancedError 
}: ErrorFallbackProps) {
  const router = useRouter();

  // Determine which message to display (enhanced or original)
  const displayMessage = enhancedError?.optimizedMessage || error.message;
  
  // Get error category and severity
  const category = enhancedError?.category || 'system';
  const severity = enhancedError?.severity || 'medium';
  
  // Get symbolic representation
  const symbol = enhancedError?.symbolicRepresentation || '❓⟨unknown⟩⚠️:Error';
  
  // Get suggestions
  const suggestions = enhancedError?.suggestions || [];

  // Determine background color based on severity
  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 border-destructive';
      case 'high': return 'bg-orange-100 border-orange-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-blue-100 border-blue-500';
      default: return 'bg-muted border-muted-foreground';
    }
  };

  // Determine icon based on category
  const getCategoryIcon = () => {
    switch (category) {
      case 'validation': return '☲';
      case 'authentication': return '🔒';
      case 'authorization': return '🛡️';
      case 'network': return '🌐';
      case 'database': return '💾';
      case 'external_service': return '🔌';
      case 'rate_limit': return '⏱️';
      case 'business_logic': return '🧩';
      case 'system': return '⚙️';
      default: return '❓';
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      {enhancedError ? (
        <div className={`p-6 rounded-lg border-l-4 ${getSeverityColor()} max-w-3xl w-full`}>
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">{getCategoryIcon()}</div>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
          </div>
          
          <div className="mb-4">
            <div className="font-mono text-sm bg-background text-foreground p-2 rounded">
              {symbol}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-lg font-medium">{displayMessage}</p>
            <p className="text-sm text-muted-foreground mt-1">{error.name}</p>
          </div>
          
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Suggestions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Stack Trace:</h3>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                {error.stack}
              </pre>
            </div>
          )}
          
          <Button onClick={resetErrorBoundary}>Try Again</Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            We're sorry for the inconvenience. Please try again.
          </p>
          <Button onClick={resetErrorBoundary}>Try Again</Button>
        </>
      )}
    </div>
  );
}
