import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';

export interface Metrics {
  labels: string[];
  data: number[];
}

export interface Project {
  id: string;
  name: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  dueDate: string;
}

export interface EmployeePerformance {
  id: string;
  name: string;
  completedTasks: number;
  rating: number;
  department: string;
  lastEvaluation: string;
}

interface ChatbotMetrics {
  usageData: number[];
  months: string[];
}

interface SocialMediaMetrics {
  platforms: {
    name: string;
    followers: number;
    engagementRate: number;
    posts: number;
  }[];
  totalFollowers: number;
  totalEngagement: number;
}

interface AgencyData {
  metrics: {
    labels: string[];
    data: number[];
  };
  projects: Project[];
  employees: EmployeePerformance[];
  chatbot: ChatbotMetrics;
  socialMedia: SocialMediaMetrics;
}

export const useAgencyData = () => {
  const [data, setData] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AgencyData>('/api/agency-data', {
          params: {
            mock: true,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error('Error fetching agency data:', err);
        setError('Failed to fetch agency data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chatbotMetrics = useMemo(() => {
    return data?.chatbot || {
      usageData: [],
      months: [],
    };
  }, [data?.chatbot]);

  return {
    data,
    loading,
    error,
    chatbotMetrics,
  };
};
