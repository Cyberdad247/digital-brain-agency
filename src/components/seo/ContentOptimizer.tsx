import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const ContentOptimizer = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const mockAnalysis = {
        wordCount: content.split(' ').length,
        readabilityScore: 78,
        keywordDensity: {
          mainKeyword: 'SEO',
          density: 2.5,
          recommended: 1.5
        },
        suggestions: [
          'Add more internal links',
          'Include more long-tail keywords',
          'Break up long paragraphs'
        ]
      };
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your content here..."
          rows={8}
        />
        <Button onClick={handleAnalyze} disabled={isLoading || !content.trim()}>
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </Button>

        {analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Word Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.wordCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Readability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.readabilityScore}/100</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Density</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.keywordDensity.density}%</div>
                  <div className="text-sm text-gray-400">
                    ({analysis.keywordDensity.recommended}% recommended)
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentOptimizer;
