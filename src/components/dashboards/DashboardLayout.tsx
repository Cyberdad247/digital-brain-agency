import { ReactNode } from 'react';
import { Sidebar } from '../ui/sidebar';
import Header from '../Header';
import { Toaster } from '../ui/toaster';
import { UserProfileCard } from './UserProfileCard';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[200px]">
        <Header />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {children}
            </div>
            <div className="lg:col-span-1 space-y-8">
              <UserProfileCard />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
