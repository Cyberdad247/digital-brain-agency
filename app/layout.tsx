import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AgencyLayout } from '../src/components/AgencyLayout';
import { ClientErrorBoundary } from '@/components/ClientErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Brain Agency',
  description: 'AI-Powered Digital Marketing Agency',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientErrorBoundary>
          <AgencyLayout variant="dashboard">{children}</AgencyLayout>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
