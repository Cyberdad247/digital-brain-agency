import { useState, useEffect } from 'react';
import axios from 'axios';

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
            mock: true
          }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch agency data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    data,
    loading,
    error,
    chatbotMetrics: data?.chatbot || {
      usageData: [],
      months: []
    }
  };
};
