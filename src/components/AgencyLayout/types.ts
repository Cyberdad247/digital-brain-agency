import { ReactNode } from 'react';

export interface AgencyLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dashboard';
}
