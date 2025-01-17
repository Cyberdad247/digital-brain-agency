import React from 'react';
import BarChart from '../charts/BarChart';

const AIStrategyDashboard = () => {
  const strategyData = {
    labels: ['AI Adoption', 'Model Accuracy', 'ROI', 'Implementation'],
    data: [85, 92, 78, 88]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">AI Strategy Overview</h2>
          <BarChart 
            data={strategyData.data}
            labels={strategyData.labels}
            title="AI Strategy Metrics"
          />
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Model Accuracy</span>
              <span className="font-bold">92%</span>
            </div>
            <div className="flex justify-between">
              <span>Implementation Progress</span>
              <span className="font-bold">88%</span>
            </div>
            <div className="flex justify-between">
              <span>ROI Improvement</span>
              <span className="font-bold">78%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Recent AI Strategy Updates</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>New model deployed</span>
            <span className="text-gray-400">2 days ago</span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy improved by 5%</span>
            <span className="text-gray-400">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStrategyDashboard;
