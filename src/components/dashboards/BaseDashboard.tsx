import { ReactNode, useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface BaseDashboardProps {
  title: string;
  description?: string;
  children: ReactNode;
  loading?: boolean;
  error?: Error | null;
}

const BaseDashboard = ({ 
  title, 
  description, 
  children, 
  loading = false,
  error = null 
}: BaseDashboardProps) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  if (error) {
    return (
      <DashboardLayout title={title} description={description}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || 'An error occurred while loading the dashboard'}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={title} description={description}>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[125px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ) : (
        children
      )}
    </DashboardLayout>
  );
};

export default BaseDashboard;
