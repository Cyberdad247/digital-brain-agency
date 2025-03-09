'use client';

import { ClientErrorBoundary } from '@/components/ClientErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <ClientErrorBoundary fallback={<ErrorFallback reset={reset} />}>
          <button onClick={() => reset()} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Try again
          </button>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}