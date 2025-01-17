import React from 'react';
import BarChart from '../charts/BarChart';

const WebAnalysisDashboard: React.FC = () => {
  const webData = {
    labels: ['Visits', 'Page Views', 'Bounce Rate', 'Avg. Session'],
    data: [12000, 45000, 35, 3.5],
    title: 'Website Traffic Analysis'
  };

  return (
    <div className="dashboard-container">
      <h2>Web Analysis Dashboard</h2>
      <div className="chart-container">
        <BarChart 
          data={webData.data}
          labels={webData.labels}
          title={webData.title}
        />
      </div>
    </div>
  );
};

export default WebAnalysisDashboard;
