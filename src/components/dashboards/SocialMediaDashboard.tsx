import { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SocialMediaPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: 'draft' | 'scheduled' | 'published';
}

interface SocialMediaDashboardProps {
  loading: boolean;
  socialMediaData: {
    posts?: SocialMediaPost[];
    platforms?: string[];
    analytics?: {
      engagementRate: number;
      reach: number;
      impressions: number;
    };
  };
}

const SocialMediaDashboard = ({ loading, socialMediaData }: SocialMediaDashboardProps) => {
  const [newPost, setNewPost] = useState({
    content: '',
    platforms: [],
    scheduledTime: new Date()
  });

  const handleCreatePost = () => {
    // TODO: Implement post creation
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Content Creation Section */}
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="Write your post content..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <Select 
            onValueChange={(value) => setNewPost({ ...newPost, platforms: [value] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {socialMediaData.platforms?.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Calendar
            mode="single"
            selected={newPost.scheduledTime}
            onSelect={(date) => date && setNewPost({ ...newPost, scheduledTime: date })}
          />
          <Button onClick={handleCreatePost}>Schedule Post</Button>
        </div>
      </div>

      {/* Scheduled Posts Section */}
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
        <div className="space-y-2">
          {socialMediaData.posts?.map((post) => (
            <div key={post.id} className="p-4 border rounded">
              <p>{post.content}</p>
              <div className="text-sm text-gray-500">
                {post.platforms.join(', ')} - {post.scheduledTime.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <div className="space-y-2">
          <div className="p-4 border rounded">
            <h3>Engagement Rate</h3>
            <p>{socialMediaData.analytics?.engagementRate}%</p>
          </div>
          <div className="p-4 border rounded">
            <h3>Reach</h3>
            <p>{socialMediaData.analytics?.reach}</p>
          </div>
          <div className="p-4 border rounded">
            <h3>Impressions</h3>
            <p>{socialMediaData.analytics?.impressions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDashboard;
