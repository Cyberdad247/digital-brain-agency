import { useState } from 'react';
import StatsCard from './StatsCard';
import AnalyticsIcon from '../../../public/icons/analytics.svg';
import MarketingIcon from '../../../public/icons/marketing.svg';
import ChatbotIcon from '../../../public/icons/chatbot.svg';
import SocialMediaIcon from '../../../public/icons/social-media.svg';

export const SocialMediaAdDashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Impressions"
          value="1.2M"
          icon={<span className="w-6 h-6"><AnalyticsIcon /></span>}
          trend="up"
        />
        <StatsCard 
          title="Engagement Rate"
          value="8.5%"
          icon={<span className="w-6 h-6"><MarketingIcon /></span>}
          trend="up"
        />
        <StatsCard 
          title="CTR"
          value="2.3%"
          icon={<span className="w-6 h-6"><ChatbotIcon /></span>}
          trend="down"
        />
        <StatsCard 
          title="Total Spend"
          value="$12,500"
          icon={<span className="w-6 h-6"><SocialMediaIcon /></span>}
          trend="neutral"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Platform Integration</h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'facebook'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
              onClick={() => setSelectedPlatform('facebook')}
            >
              Facebook
            </button>
            <button
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'instagram'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100'
              }`}
              onClick={() => setSelectedPlatform('instagram')}
            >
              Instagram
            </button>
            <button
              className={`px-4 py-2 rounded ${
                selectedPlatform === 'twitter'
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-100'
              }`}
              onClick={() => setSelectedPlatform('twitter')}
            >
              Twitter
            </button>
          </div>

          {selectedPlatform === 'facebook' && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label>Facebook Page ID</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Enter your Facebook Page ID"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Access Token</label>
                <input
                  type="password"
                  className="border p-2 rounded"
                  placeholder="Enter your access token"
                />
              </div>
            </div>
          )}

          {selectedPlatform === 'instagram' && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label>Instagram Business Account ID</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Enter your Instagram Business Account ID"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Access Token</label>
                <input
                  type="password"
                  className="border p-2 rounded"
                  placeholder="Enter your access token"
                />
              </div>
            </div>
          )}

          {selectedPlatform === 'twitter' && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label>Twitter API Key</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Enter your Twitter API Key"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Twitter API Secret</label>
                <input
                  type="password"
                  className="border p-2 rounded"
                  placeholder="Enter your Twitter API Secret"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
