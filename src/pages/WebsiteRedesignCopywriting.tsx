    2rimport { WebsiteRedesignForm } from '../components/website-redesign/WebsiteRedesignForm';
import { WebsiteRedesignFormData } from '../components/website-redesign/types';
import { CopywritingForm } from '../components/copywriting/CopywritingForm';
import { CopywritingFormData } from '../components/copywriting/types';
import { WebsiteRedesignCopywritingDashboard } from '../components/dashboards/WebsiteRedesignCopywritingDashboard';

export default function WebsiteRedesignCopywriting() {
  const handleWebsiteRedesignSubmit = (data: WebsiteRedesignFormData) => {
    console.log('Website Redesign Data:', data);
    // TODO: Add API integration
  };

  const handleCopywritingSubmit = (data: CopywritingFormData) => {
    console.log('Copywriting Data:', data);
    // TODO: Add API integration
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Website Redesign</h2>
          <WebsiteRedesignForm onSubmit={handleWebsiteRedesignSubmit} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Copywriting</h2>
          <CopywritingForm onSubmit={handleCopywritingSubmit} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Performance Dashboard</h2>
        <WebsiteRedesignCopywritingDashboard />
      </div>
    </div>
  );
}
