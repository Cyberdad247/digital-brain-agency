import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

const TechnicalAudit = () => {
  const [url, setUrl] = useState('');
  const [auditResults, setAuditResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const mockResults = {
        score: 82,
        issues: [
          { 
            type: 'meta_description',
            status: 'missing',
            pages: 12,
            severity: 'high'
          },
          {
            type: 'alt_text',
            status: 'missing',
            pages: 8,
            severity: 'medium'
          },
          {
            type: 'canonical_tags',
            status: 'duplicate',
            pages: 3,
            severity: 'low'
          }
        ]
      };
      setAuditResults(mockResults);
    } catch (error) {
      console.error('Error performing technical audit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical SEO Audit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL..."
          />
          <Button onClick={handleAudit} disabled={isLoading || !url.trim()}>
            {isLoading ? 'Auditing...' : 'Run Audit'}
          </Button>
        </div>

        {auditResults && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={auditResults.score} className="h-2" />
                  <div className="text-2xl font-bold">{auditResults.score}/100</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identified Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {auditResults.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        issue.severity === 'high' ? 'bg-red-500' :
                        issue.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></span>
                      <div>
                        <div className="font-medium">{issue.type}</div>
                        <div className="text-sm text-gray-400">{issue.status}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{issue.pages} pages affected</div>
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

export default TechnicalAudit;
