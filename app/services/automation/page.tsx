import { Suspense } from 'react';
import ServiceDashboardTemplate from '@/components/dashboards/ServiceDashboardTemplate';

const metrics = [
  {
    label: 'Automated Tasks',
    value: '1,248',
    change: 45,
  },
  {
    label: 'Time Saved',
    value: '520h',
    change: 38,
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: 5,
  },
  {
    label: 'Cost Reduction',
    value: '42%',
    change: 15,
  },
];

const charts = [
  {
    title: 'Automation Performance',
    data: [85, 95, 110, 132, 158, 180],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    title: 'Resource Optimization',
    data: [25, 35, 45, 52, 68, 75],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
];

export default function AutomationDashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <ServiceDashboardTemplate
        serviceId="automation"
        title="Automation Dashboard"
        description="Monitor your automation workflows and efficiency metrics"
        metrics={metrics}
        charts={charts}
      />
    </Suspense>
  );
}
