import { useState } from 'react';

interface CopywritingFormProps {
  onSubmit: (data: any) => void;
}

export const CopywritingForm = ({ onSubmit }: CopywritingFormProps) => {
  const [tone, setTone] = useState('');
  const [keyMessages, setKeyMessages] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tone,
      keyMessages,
      targetKeywords
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Copywriting</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Desired Tone</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Professional, Friendly, Authoritative"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Key Messages</label>
          <textarea
            value={keyMessages}
            onChange={(e) => setKeyMessages(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Main points to communicate"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Keywords</label>
          <input
            type="text"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., digital marketing, web design"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Submit Copywriting
        </button>
      </div>
    </form>
  );
};
