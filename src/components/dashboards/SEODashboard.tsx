import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { FileInput } from '../ui/file-input';
import { Checkbox } from '../ui/checkbox';
import { Wand2, FileText, Clipboard } from 'lucide-react';

const SEODashboard = () => {
  const [inputText, setInputText] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleTextInput = (e) => {
    setInputText(e.target.value);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        setInputText(e.target.result);
      } else {
        console.error('Failed to read file as text');
      }
    };
    reader.readAsText(file);
  };

  const analyzeSEO = () => {
    // TODO: Implement SEO analysis logic
    const results = [
      { id: 1, suggestion: 'Add more keywords in first paragraph', type: 'keyword' },
      { id: 2, suggestion: 'Add meta description', type: 'meta' },
      { id: 3, suggestion: 'Improve heading structure', type: 'structure' },
      { id: 4, suggestion: 'Add alt text to images', type: 'accessibility' },
    ];
    setAnalysisResults(results);
  };

  const handleOptionChange = (id, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const applyChanges = () => {
    const selectedSuggestions = analysisResults.filter(result => selectedOptions[result.id]);
    // TODO: Implement change application logic
    console.log('Applying changes:', selectedSuggestions);
  };

  return (
    <div className="seo-dashboard space-y-4">
      <div className="input-section grid grid-cols-2 gap-4">
        <div className="text-input">
          <Textarea
            placeholder="Paste your content here..."
            value={inputText}
            onChange={handleTextInput}
            rows={10}
          />
          <Button className="mt-2 w-full" variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            Paste from Clipboard
          </Button>
        </div>
        
        <div className="file-upload">
          <FileInput
            accept=".pdf,.txt,.docx"
            onChange={handleFileUpload}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Supported formats: PDF, TXT, DOCX
          </p>
        </div>
      </div>

      <Button className="w-full" onClick={analyzeSEO}>
        <Wand2 className="mr-2 h-4 w-4" />
        Analyze SEO
      </Button>

      {analysisResults.length > 0 && (
        <div className="analysis-results space-y-4">
          <h3 className="text-lg font-semibold">SEO Suggestions</h3>
          {analysisResults.map(result => (
            <div key={result.id} className="flex items-center space-x-2">
              <Checkbox
                id={`suggestion-${result.id}`}
                checked={selectedOptions[result.id] || false}
                onCheckedChange={(checked) => handleOptionChange(result.id, checked)}
              />
              <label htmlFor={`suggestion-${result.id}`} className="text-sm">
                {result.suggestion}
              </label>
            </div>
          ))}
          
          <Button className="w-full" onClick={applyChanges}>
            Apply Selected Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default SEODashboard;
