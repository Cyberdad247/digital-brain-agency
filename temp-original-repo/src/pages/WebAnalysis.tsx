import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDeviceDetection } from '@/hooks/use-mobile';
import { useSpeedAnalysis } from '@/hooks/use-speed-analysis';

const WebAnalysis = () => {
  const [url, setUrl] = useState('');
  const [pageSpeed, setPageSpeed] = useState(0);
  const { isMobile, isTablet, isDesktop, isTouchDevice, deviceType } = useDeviceDetection();
  const { connectionType, downlinkSpeed, rtt, isSlowConnection, isFastConnection } = useSpeedAnalysis();

  const measurePageSpeed = async (url) => {
    try {
      const startTime = performance.now();
      await fetch(url);
      const endTime = performance.now();
      setPageSpeed(Math.round(endTime - startTime));
    } catch (error) {
      console.error('Error measuring page speed:', error);
      setPageSpeed(-1);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-black/90 backdrop-blur-sm">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Web Analytics Dashboard
      </h1>
      <div className="flex gap-2 mb-8">
        <Input
          type="url"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-900 border-2 border-purple-500/50 text-purple-200 placeholder-purple-400/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
        />
        <Button 
          onClick={() => {
            console.log('Analyzing:', url);
            measurePageSpeed(url);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-500/30"
        >
          Analyze
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Total Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">0</div>
            <p className="text-xs text-purple-300/70">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">0</div>
            <p className="text-xs text-purple-300/70">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">0%</div>
            <p className="text-xs text-purple-300/70">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Avg. Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">0m 0s</div>
            <p className="text-xs text-purple-300/70">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Page Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {pageSpeed > 0 ? `${pageSpeed}ms` : 'N/A'}
            </div>
            <p className="text-xs text-purple-300/70">
              {pageSpeed > 0 ? 'Time to first byte' : 'Not measured'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Device Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400 capitalize">{deviceType}</div>
            <p className="text-xs text-purple-300/70">
              {isMobile && 'Mobile device'}
              {isTablet && 'Tablet device'}
              {isDesktop && 'Desktop device'}
              {isTouchDevice && ' (Touch enabled)'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Network Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {downlinkSpeed > 0 ? `${downlinkSpeed} Mbps` : 'N/A'}
            </div>
            <p className="text-xs text-purple-300/70">
              {connectionType} connection
              {rtt > 0 && ` • ${rtt}ms latency`}
            </p>
            <p className="text-xs text-purple-300/70 mt-1">
              {isSlowConnection && 'Slow connection'}
              {isFastConnection && 'Fast connection'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2">
        <Card className="col-span-2 bg-gray-900/50 border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <CardHeader>
            <CardTitle className="text-purple-300">Visitor Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-500/20">
              <p className="text-purple-300/50">Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebAnalysis;
