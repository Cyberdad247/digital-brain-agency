'use client';

import BaseDashboard from './BaseDashboard';
import { useAgencyData } from '../../hooks/useAgencyData';
import BarChart from '../charts/BarChart';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useMemo } from 'react';

interface ServiceDashboardTemplateProps {
  serviceId: string;
  title: string;
  description?: string;
  metrics: {
    label: string;
    value: number | string;
    change?: number;
  }[];
  charts?: {
    title: string;
    data: number[];
    labels: string[];
  }[];
}

const ServiceDashboardTemplate = ({
  serviceId,
  title,
  description,
  metrics,
  charts,
}: ServiceDashboardTemplateProps) => {
  const { data, loading, error } = useAgencyData();

  const processedMetrics = useMemo(() => {
    if (!data) return metrics;
    return metrics.map((metric) => ({
      ...metric,
      value: data[metric.label.toLowerCase()] || metric.value,
    }));
  }, [data, metrics]);

  return (
    <BaseDashboard
      title={title}
      description={description}
      loading={loading}
      error={error ? new Error(error) : null}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processedMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change && (
                <p className="text-xs text-muted-foreground">
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}% from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {charts && charts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {charts.map((chart, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={chart.data} labels={chart.labels} title={chart.title} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </BaseDashboard>
  );
};

export default ServiceDashboardTemplate;
