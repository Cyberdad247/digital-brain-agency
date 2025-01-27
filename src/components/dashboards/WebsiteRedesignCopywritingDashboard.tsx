intimport { useState } from 'react';
import StatsCard from './StatsCard';
import { apiClient } from '../../utils/apiClient';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface WebsiteRedesignResponse {
  id: string;
  projectName: string;
  status: string;
  createdAt: string;
}

interface CopywritingResponse {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}
import { WebsiteRedesignForm } from '../website-redesign/WebsiteRedesignForm';
import { CopywritingForm } from '../copywriting/CopywritingForm';
import ProjectIcon from '../../public/icons/project.svg';
import CheckCircleIcon from '../../public/icons/check-circle.svg';
import SmileIcon from '../../public/icons/smile.svg';
import ClockIcon from '../../public/icons/clock.svg';

export const WebsiteRedesignCopywritingDashboard = () => {
  const [activeTab, setActiveTab] = useState<'redesign' | 'copywriting'>('redesign');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Projects"
          value="12"
          trend="up"
          icon={<div className="w-6 h-6"><ProjectIcon /></div>}
        />
        <StatsCard 
          title="Completed Projects"
          value="45"
          trend="neutral"
          icon={<div className="w-6 h-6"><CheckCircleIcon /></div>}
        />
        <StatsCard 
          title="Satisfaction Rate"
          value="96%"
          trend="up"
          icon={<div className="w-6 h-6"><SmileIcon /></div>}
        />
        <StatsCard 
          title="Avg. Delivery Time"
          value="7 days"
          trend="down"
          icon={<div className="w-6 h-6"><ClockIcon /></div>}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'redesign'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('redesign')}
          >
            Website Redesign
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'copywriting'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab('copywriting')}
          >
            Copywriting
          </button>
        </div>

        {activeTab === 'redesign' && (
          <WebsiteRedesignForm 
            onSubmit={async (data) => {
              try {
                const response = await apiClient.post<ApiResponse<WebsiteRedesignResponse>>('/website-redesign', data);
                console.log('Redesign created:', response.data);
                // Update stats or show success notification
              } catch (error) {
                console.error('Redesign submission failed:', error);
                // Show error notification
              }
            }}
          />
        )}
        {activeTab === 'copywriting' && (
          <CopywritingForm 
            onSubmit={async (data) => {
              try {
                const response = await apiClient.post<ApiResponse<CopywritingResponse>>('/copywriting', data);
                console.log('Copywriting created:', response.data);
                // Update stats or show success notification
              } catch (error) {
                console.error('Copywriting submission failed:', error);
                // Show error notification
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
