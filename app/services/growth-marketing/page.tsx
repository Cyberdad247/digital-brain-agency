import { Suspense } from 'react';
import ServiceDashboardTemplate from '@/components/dashboards/ServiceDashboardTemplate';

const metrics = [
  {
    label: 'Conversion Rate',
    value: '8.5%',
    change: 15,
  },
  {
    label: 'Customer Acquisition',
    value: '342',
    change: 28,
  },
  {
    label: 'Revenue Growth',
    value: '156%',
    change: 45,
  },
  {
    label: 'Campaign ROI',
    value: '320%',
    change: 32,
  },
];

const charts = [
  {
    title: 'Marketing Performance',
    data: [45, 62, 85, 98, 112, 135],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  {
    title: 'Customer Growth',
    data: [150, 185, 225, 280, 320, 342],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
];

export default function GrowthMarketingDashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <ServiceDashboardTemplate
        serviceId="growth-marketing"
        title="Growth Marketing Dashboard"
        description="Track your marketing campaigns and growth metrics"
        metrics={metrics}
        charts={charts}
      />
    </Suspense>
  );
}
