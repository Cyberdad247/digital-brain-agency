import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { ContentPerformanceProps } from '../../types/contentTypes';

const ContentPerformance = ({ content }: ContentPerformanceProps) => {
  const performanceData = content || [
    { name: 'Blog Post 1', views: 4000, shares: 2400 },
    { name: 'Blog Post 2', views: 3000, shares: 1398 },
    { name: 'Video 1', views: 2000, shares: 9800 },
    { name: 'Infographic', views: 2780, shares: 3908 },
    { name: 'Case Study', views: 1890, shares: 4800 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
              <Bar dataKey="shares" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPerformance;
