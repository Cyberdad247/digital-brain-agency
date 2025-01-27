import React, { useState } from 'react';
import SEODashboard from '../components/dashboards/SEODashboard';
import StatsCard from '../components/dashboards/StatsCard';
import BarChart from '../components/charts/BarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import KeywordResearch from '../components/seo/KeywordResearch';
import ContentOptimizer from '../components/seo/ContentOptimizer';
import TechnicalAudit from '../components/seo/TechnicalAudit';
import BacklinkTracker from '../components/seo/BacklinkTracker';

const SEOPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">SEO Optimization</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Organic Traffic"
          value="12.4K"
          description="Last 30 days"
          icon="chart-bar"
        />
        <StatsCard
          title="Keyword Rankings"
          value="256"
          description="Top 10 positions"
          icon="trending-up"
        />
        <StatsCard
          title="Backlinks"
          value="1.2K"
          description="New this month"
          icon="link"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Research</TabsTrigger>
          <TabsTrigger value="content">Content Optimization</TabsTrigger>
          <TabsTrigger value="technical">Technical Audit</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SEODashboard />
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Keyword Performance</h2>
            <BarChart
              title="Top Performing Keywords"
              data={[120, 98, 76, 65, 54]}
              labels={['SEO Tools', 'Marketing', 'Analytics', 'Automation', 'AI']}
            />
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordResearch />
        </TabsContent>

        <TabsContent value="content">
          <ContentOptimizer />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalAudit />
        </TabsContent>

        <TabsContent value="backlinks">
          <BacklinkTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOPage;
