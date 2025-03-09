import React from 'react';
import BarChart from './charts/BarChart';

interface EmployeePerformanceProps {
  performanceData?: {
    labels: string[];
    data: number[];
  };
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ performanceData }) => {
  const defaultData = {
    labels: ['John', 'Sarah', 'Mike', 'Emily', 'David'],
    data: [85, 90, 78, 92, 88],
  };

  const data = performanceData || defaultData;

  return (
    <div className="employee-performance">
      <h2>Employee Performance Metrics</h2>
      <BarChart data={data.data} labels={data.labels} title="Performance Scores" />
    </div>
  );
};

export default EmployeePerformance;
