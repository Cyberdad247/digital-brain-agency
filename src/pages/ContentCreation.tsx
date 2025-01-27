import React from 'react';
import ContentCreationDashboard from '../components/dashboards/ContentCreationDashboard';
import LandingPageCreationDashboard from '../components/dashboards/LandingPageCreationDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const ContentCreation = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-lime-300 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 uppercase tracking-wider">Content Creation</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-lime-500">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="content">Content Creation</TabsTrigger>
              <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <ContentCreationDashboard />
            </TabsContent>
            
            <TabsContent value="landing-pages">
              <LandingPageCreationDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;
