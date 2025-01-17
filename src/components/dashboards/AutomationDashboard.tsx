import React from 'react';
import BarChart from '../charts/BarChart';

const AutomationDashboard: React.FC = () => {
  const automationData = {
    labels: ['Workflows', 'Tasks Completed', 'Errors', 'Time Saved'],
    data: [15, 1200, 3, 240],
    title: 'Automation Performance'
  };

  return (
    <div className="dashboard-container">
      <h2>Automation Dashboard</h2>
      <div className="chart-container">
        <BarChart 
          data={automationData.data}
          labels={automationData.labels}
          title={automationData.title}
        />
      </div>
    </div>
  );
};

export default AutomationDashboard;
