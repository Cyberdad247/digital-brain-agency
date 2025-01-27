import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { agencyService } from '../../lib/services/agencyService';
import { toast } from 'react-hot-toast';

interface ContentIdea {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'in-progress' | 'published';
  created: Date;
}

interface ContentIdeasProps {
  agencyId: string;
}

const ContentIdeas = ({ agencyId }: ContentIdeasProps) => {
  const [newIdea, setNewIdea] = React.useState('');
  const [ideas, setIdeas] = React.useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    fetchIdeas();
  }, [agencyId]);

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const ideas = await agencyService.getContentIdeas(agencyId);
      setIdeas(ideas);
    } catch (error) {
      toast.error('Failed to fetch content ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIdea = async () => {
    if (newIdea.trim()) {
      try {
        const newIdeaItem = {
          title: newIdea,
          type: 'Blog Post',
          status: 'draft',
          agencyId
        };
        
        await agencyService.createContentIdea(newIdeaItem);
        await fetchIdeas();
        setNewIdea('');
        toast.success('Content idea added successfully');
      } catch (error) {
        toast.error('Failed to add content idea');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Ideas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Enter new content idea..."
          />
          <Button onClick={handleAddIdea}>Add Idea</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow key={idea.id}>
                <TableCell>{idea.title}</TableCell>
                <TableCell>{idea.type}</TableCell>
                <TableCell>{idea.status}</TableCell>
                <TableCell>{idea.created.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContentIdeas;
