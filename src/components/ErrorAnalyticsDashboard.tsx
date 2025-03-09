'use client';

import React, { useEffect, useState } from 'react';
import { ErrorAnalyticsService } from '../lib/error/ErrorAnalyticsService';
import { ErrorEvent, ErrorSummary } from '../lib/error/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export const ErrorAnalyticsDashboard: React.FC = () => {
  const [errorTrends, setErrorTrends] = useState<{ [key: string]: any }>({});
  const [highSeverityErrors, setHighSeverityErrors] = useState<any[]>([]);
  const [frequentErrors, setFrequentErrors] = useState<any[]>([]);
  const [errorSummary, setErrorSummary] = useState<ErrorSummary>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
  });

  useEffect(() => {
    const analyticsService = ErrorAnalyticsService.getInstance();
    const updateErrorStats = () => {
      const trends = analyticsService.getErrorTrends();
      const highSeverity = analyticsService.getHighSeverityErrors();
      const frequent = analyticsService.getMostFrequentErrors(5);

      setErrorTrends(trends);
      setHighSeverityErrors(highSeverity);
      setFrequentErrors(frequent);

      // Calculate summary
      const summary = Object.values(trends).reduce(
        (acc: ErrorSummary, error: any) => {
          acc[error.severity]++;
          acc.total++;
          return acc;
        },
        { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
      );

      setErrorSummary(summary);
    };

    // Initial update
    updateErrorStats();

    // Update every 30 seconds
    const interval = setInterval(updateErrorStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-400',
      low: 'bg-blue-400',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-white text-sm ${colors[severity as keyof typeof colors]}`}
      >
        {severity}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Error Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground">Auto-updates every 30 seconds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Critical Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{errorSummary.critical}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{errorSummary.high}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medium Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">{errorSummary.medium}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">{errorSummary.low}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>High Severity Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error Message</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highSeverityErrors.map((error: ErrorEvent) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-medium">{error.message}</TableCell>
                      <TableCell>{renderSeverityBadge(error.severity)}</TableCell>
                      <TableCell>{error.timestamp.toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Error Message</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frequentErrors.map((error: ErrorEvent) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-medium">{error.message}</TableCell>
                      <TableCell>{error.count}</TableCell>
                      <TableCell>{renderSeverityBadge(error.severity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* High Severity Errors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">High Severity Errors</h3>
        <div className="space-y-4">
          {highSeverityErrors.map((error, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{error.errorType}</p>
                  <p className="text-sm text-gray-600">
                    First seen: {new Date(error.firstOccurrence).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {renderSeverityBadge(error.severity)}
                  <span className="text-sm font-medium">Count: {error.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Frequent Errors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Most Frequent Errors</h3>
        <div className="space-y-4">
          {frequentErrors.map((error, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{error.errorType}</p>
                  <p className="text-sm text-gray-600">
                    Affected Components: {Array.from(error.affectedComponents).join(', ')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {renderSeverityBadge(error.severity)}
                  <span className="text-sm font-medium">Occurrences: {error.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
