import { useState } from 'react';

interface WebsiteRedesignFormProps {
  onSubmit: (data: any) => void;
}

export const WebsiteRedesignForm = ({ onSubmit }: WebsiteRedesignFormProps) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [designPreferences, setDesignPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      currentUrl,
      targetAudience,
      designPreferences
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Website Redesign</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Website URL</label>
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Audience</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Design Preferences</label>
          <textarea
            value={designPreferences}
            onChange={(e) => setDesignPreferences(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit Redesign
        </button>
      </div>
    </form>
  );
};
