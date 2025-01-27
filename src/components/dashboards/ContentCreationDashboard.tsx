import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import BarChart from '../charts/BarChart';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useAgencyData } from '../../hooks/useAgencyData';
import { agencyService } from '../../lib/services/agencyService';
import { toast } from 'react-hot-toast';
import ContentCalendar from '../content/ContentCalendar';
import ContentIdeas from '../content/ContentIdeas';
import ContentPerformance from '../content/ContentPerformance';

const ContentCreationDashboard = () => {
  const { agencyId } = useAgencyData();
  const [contentItems, setContentItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [editContent, setEditContent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchContent();
  }, [agencyId]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const content = await agencyService.getContent(agencyId);
      setContentItems(content);
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const contentData = {
        title: formData.get('title'),
        type: formData.get('type'),
        description: formData.get('description'),
        date: selectedDate,
        status: 'draft',
        agencyId
      };

      if (editContent) {
        await agencyService.updateContent(editContent.id, contentData);
        toast.success('Content updated successfully');
      } else {
        await agencyService.createContent(contentData);
        toast.success('Content created successfully');
      }
      
      fetchContent();
      setEditContent(null);
      e.target.reset();
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const handleDelete = async (id) => {
    try {
      await agencyService.deleteContent(id);
      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const handleEdit = (content) => {
    setEditContent(content);
    setSelectedDate(new Date(content.date));
  };

  const filteredContent = contentItems
    .filter(item => filter === 'all' || item.status === filter)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sort === 'newest') return dateB - dateA;
      return dateA - dateB;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Content Created"
          value={contentItems.length}
          description="Total pieces of content"
          icon="document-text"
        />
        <StatsCard
          title="Engagement Rate"
          value="78%"
          description="Average engagement"
          icon="chat-alt"
        />
        <StatsCard
          title="Content Requests"
          value="24"
          description="Pending requests"
          icon="inbox"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-700 p-4 rounded-lg col-span-2">
          <h2 className="text-lg font-semibold mb-4">Content Performance</h2>
          <ContentPerformance content={contentItems} />
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Content Calendar</h2>
          <ContentCalendar content={contentItems} />
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Create New Content</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full p-2 bg-gray-600 rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <FormControl>
                <select
                  name="type"
                  required
                  className="w-full p-2 bg-gray-600 rounded"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="graphic">Graphic</option>
                  <option value="social">Social Media Post</option>
                </select>
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-2 bg-gray-600 rounded"
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Publish Date</FormLabel>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-gray-600"
              />
            </FormItem>

            <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600">
              Create Content
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Content Library</h2>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 bg-gray-600 rounded"
            >
              <option value="all">All</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 bg-gray-600 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredContent.map((item) => (
            <div key={item.id} className="p-3 bg-gray-600 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-300">
                  {item.type} - {format(item.date, 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-lime-500 hover:text-lime-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'draft' ? 'bg-yellow-500' :
                  item.status === 'published' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Content Ideas</h2>
        <ContentIdeas agencyId={agencyId} />
      </div>
    </div>
  );
};

export default ContentCreationDashboard;
