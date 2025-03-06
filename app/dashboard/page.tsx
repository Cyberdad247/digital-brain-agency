import BaseDashboard from '@/src/components/dashboards/BaseDashboard';
import AgencyMetrics from '@/src/components/AgencyMetrics';
import ProjectStatus from '@/src/components/ProjectStatus';
import EmployeePerformance from '@/src/components/EmployeePerformance';
import ResourceList from '@/src/components/ResourceList';

export default function DashboardPage() {
  return (
    <BaseDashboard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <AgencyMetrics />
        <ProjectStatus />
        <EmployeePerformance />
        <ResourceList />
      </div>
    </BaseDashboard>
  );
}