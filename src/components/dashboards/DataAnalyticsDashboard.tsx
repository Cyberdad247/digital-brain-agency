import BarChart from '@/components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DataAnalyticsDashboard = () => {
  const websiteTrafficData = [1200, 1900, 3000, 5000, 2000, 3000];
  const websiteTrafficLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const conversionRates = [12, 19, 3, 5, 2, 3];
  const conversionLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={websiteTrafficData}
            labels={websiteTrafficLabels}
            title="Monthly Visitors"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={conversionRates} labels={conversionLabels} title="Conversion %" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Total Visitors</h3>
            <p className="text-2xl font-bold">16,100</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Bounce Rate</h3>
            <p className="text-2xl font-bold">42%</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Avg. Session Duration</h3>
            <p className="text-2xl font-bold">4m 12s</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
