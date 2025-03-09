import { Suspense } from 'react';
import ServiceDashboardTemplate from '@/components/dashboards/ServiceDashboardTemplate';

const metrics = [
  {
    label: 'Data Points Analyzed',
    value: '2.5M',
    change: 35,
  },
  {
    label: 'Accuracy Rate',
    value: '99.2%',
    change: 2,
  },
  {
    label: 'Insights Generated',
    value: '1,248',
    change: 28,
  },
  {
    label: 'Time Saved',
    value: '450h',
    change: 42,
  },
];

const charts = [
  {
    title: 'Analysis Volume',
    data: [120, 145, 178, 205, 242, 298],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    title: 'Efficiency Gains',
    data: [25, 38, 42, 57, 63, 75],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
];

export default function DataAnalyticsDashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <ServiceDashboardTemplate
        serviceId="data-analytics"
        title="Data Analytics Dashboard"
        description="Track your data analysis performance and insights generation"
        metrics={metrics}
        charts={charts}
      />
    </Suspense>
  );
}
