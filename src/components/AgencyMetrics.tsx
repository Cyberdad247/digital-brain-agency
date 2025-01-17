import React from 'react';
import BarChart from './charts/BarChart';

interface Metrics {
  labels: string[];
  data: number[];
}

interface AgencyMetricsProps {
  metrics?: Metrics;
}

const AgencyMetrics: React.FC<AgencyMetricsProps> = ({ metrics }) => {
  const defaultMetrics = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [65, 59, 80, 81, 56, 55]
  };

  const metricsData = metrics || defaultMetrics;

  return (
    <div className="agency-metrics">
      <h2>Agency Performance Metrics</h2>
      <BarChart 
        data={metricsData.data}
        labels={metricsData.labels}
        title="Monthly Performance"
      />
    </div>
  );
};

export default AgencyMetrics;
