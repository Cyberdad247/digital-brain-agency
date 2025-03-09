import { Suspense } from 'react';
import ServiceDashboardTemplate from '@/components/dashboards/ServiceDashboardTemplate';

const metrics = [
  {
    label: 'Active Projects',
    value: 12,
    change: 20,
  },
  {
    label: 'Success Rate',
    value: '94%',
    change: 5,
  },
  {
    label: 'ROI',
    value: '285%',
    change: 15,
  },
  {
    label: 'Client Satisfaction',
    value: '4.8/5',
    change: 8,
  },
];

const charts = [
  {
    title: 'Monthly Performance',
    data: [65, 72, 86, 81, 90, 95],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    title: 'Client Growth',
    data: [10, 15, 18, 22, 25, 30],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
];

export default function AIStrategyDashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <ServiceDashboardTemplate
        serviceId="ai-strategy"
        title="AI Strategy Dashboard"
        description="Monitor and analyze your AI strategy implementation performance"
        metrics={metrics}
        charts={charts}
      />
    </Suspense>
  );
}
