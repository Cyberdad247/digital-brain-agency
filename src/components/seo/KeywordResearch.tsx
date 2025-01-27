import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const KeywordResearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const mockResults = [
        { keyword: `${keyword} tools`, volume: 1200, difficulty: 45 },
        { keyword: `best ${keyword}`, volume: 980, difficulty: 52 },
        { keyword: `${keyword} for beginners`, volume: 760, difficulty: 38 },
      ];
      setResults(mockResults);
    } catch (error) {
      console.error('Error fetching keyword data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Research</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter seed keyword..."
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Keyword Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{result.keyword}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>Search Volume: {result.volume}</div>
                    <div>Difficulty: {result.difficulty}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordResearch;
