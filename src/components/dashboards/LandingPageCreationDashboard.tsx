import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import BaseDashboard from './BaseDashboard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const LandingPageCreationDashboard = () => {
  return (
    <BaseDashboard title="Landing Page Creation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Page Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <div className="space-y-4">
                  <Input placeholder="Page Title" />
                  <Textarea placeholder="Hero Section Content" rows={4} />
                  <Textarea placeholder="Features Section Content" rows={4} />
                  <Textarea placeholder="Call to Action" rows={2} />
                </div>
              </TabsContent>

              <TabsContent value="design">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Color Scheme
                    </label>
                    <Input type="color" className="w-24 h-10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Family
                    </label>
                    <select className="w-full p-2 border rounded">
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <Input placeholder="Page URL Slug" />
                  <Input placeholder="Meta Title" />
                  <Textarea placeholder="Meta Description" rows={2} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 min-h-[400px]">
              <p className="text-gray-500">Page preview will appear here</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>Publish Page</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseDashboard>
  );
};

export default LandingPageCreationDashboard;
