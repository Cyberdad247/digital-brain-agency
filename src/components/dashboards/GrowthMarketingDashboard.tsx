import AgencyMetricsComponent from '@/components/AgencyMetrics';
import EmployeePerformanceComponent from '@/components/EmployeePerformance';
import ProjectStatusComponent from '@/components/ProjectStatus';

const AgencyMetrics = AgencyMetricsComponent as React.FC<AgencyMetricsProps>;
const EmployeePerformance = EmployeePerformanceComponent as React.FC<EmployeePerformanceProps>;
const ProjectStatus = ProjectStatusComponent as React.FC<ProjectStatusProps>;

interface Metric {
  name: string;
  value: string | number;
}

interface Project {
  name: string;
  status: string;
}

interface AgencyMetricsProps {
  title: string;
  metrics: Metric[];
}

interface EmployeePerformanceProps {
  title: string;
  metrics: Metric[];
}

interface ProjectStatusProps {
  title: string;
  projects: Project[];
}

export const GrowthMarketingDashboard = () => {
  return (
    <div className="space-y-6">
      <AgencyMetrics 
        title="Growth Marketing Metrics"
        metrics={[
          { name: 'ROI', value: '4.5x' },
          { name: 'CAC', value: '$120' },
          { name: 'LTV', value: '$540' },
          { name: 'Conversion Rate', value: '8.2%' }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmployeePerformance 
          title="Team Performance"
          metrics={[
            { name: 'Campaigns Launched', value: 12 },
            { name: 'A/B Tests Completed', value: 8 },
            { name: 'New Channels Tested', value: 3 }
          ]}
        />
        <ProjectStatus 
          title="Active Campaigns"
          projects={[
            { name: 'Email Sequence Optimization', status: 'In Progress' },
            { name: 'Social Media Expansion', status: 'Planning' },
            { name: 'Referral Program', status: 'Testing' }
          ]}
        />
      </div>
    </div>
  );
};
