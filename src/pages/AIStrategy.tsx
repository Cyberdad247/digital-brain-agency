import React from 'react';
import AIStrategyDashboard from '../components/dashboards/AIStrategyDashboard';

const AIStrategy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-lime-300 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-wider">AI Strategy Dashboard</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-lime-500">
          <AIStrategyDashboard />
        </div>
      </div>
    </div>
  );
};

export default AIStrategy;
