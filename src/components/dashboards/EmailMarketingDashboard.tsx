import ServiceDashboardTemplate from './ServiceDashboardTemplate';

const EmailMarketingDashboard = () => {
  const metrics = [
    { label: 'Open Rate', value: '0%', change: 0 },
    { label: 'Click Rate', value: '0%', change: 0 },
    { label: 'Subscribers', value: 0, change: 0 },
    { label: 'Unsubscribes', value: 0, change: 0 }
  ];

  const charts = [
    {
      title: 'Email Performance Over Time',
      data: [0, 0, 0, 0, 0, 0, 0],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    {
      title: 'Campaign Engagement',
      data: [0, 0, 0],
      labels: ['Opens', 'Clicks', 'Conversions']
    }
  ];

  return (
    <ServiceDashboardTemplate
      serviceId="email-marketing"
      title="Email Marketing Dashboard"
      description="Track and analyze your email marketing performance"
      metrics={metrics}
      charts={charts}
    />
  );
};

export default EmailMarketingDashboard;
