import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  data: number[];
  labels: string[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, labels, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
