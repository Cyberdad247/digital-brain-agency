import { Card } from '../ui/card';

export default function BacklinkTracker() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Backlink Tracker</h2>
      <div className="space-y-4">
        <p>Track and analyze your website's backlinks to monitor your link-building efforts.</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Backlink data will appear here once tracking is set up.
          </p>
        </div>
      </div>
    </Card>
  );
}
