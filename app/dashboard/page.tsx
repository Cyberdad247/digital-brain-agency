import { Suspense } from 'react';
import BaseDashboard from '@/components/dashboards/BaseDashboard';
import { AgencyMetrics } from '@/components/AgencyMetrics';
import { ProjectStatus } from '@/components/ProjectStatus';
import { EmployeePerformance } from '@/components/EmployeePerformance';

export default function DashboardPage() {
  return (
    <BaseDashboard
      title="Agency Dashboard"
      description="Monitor your agency's performance and key metrics"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading metrics...</div>}>
          <AgencyMetrics />
        </Suspense>

        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectStatus />
        </Suspense>

        <Suspense fallback={<div>Loading performance data...</div>}>
          <EmployeePerformance />
        </Suspense>
      </div>
    </BaseDashboard>
  );
}
