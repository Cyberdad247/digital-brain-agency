import { useState } from 'react';
import axios from 'axios';

interface AgentData {
  name: string;
  specialization: string;
  department: string;
}

interface UseAgentReturn {
  createAgent: (agentData: AgentData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useAgent = (): UseAgentReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createAgent = async (agentData: AgentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Replace with your actual API endpoint
      await axios.post('/api/agents', agentData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAgent,
    loading,
    error
  };
};

export default useAgent;
