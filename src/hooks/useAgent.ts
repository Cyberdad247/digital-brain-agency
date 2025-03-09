import axios from 'axios';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

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

  const createAgentRequest = async (agentData: AgentData) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/agents', agentData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create agent';
      console.error('Error creating agent:', { error: err, data: agentData });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAgent = useCallback(
    debounce(async (agentData: AgentData) => {
      await createAgentRequest(agentData);
    }, 300),
    []
  );

  return {
    createAgent,
    loading,
    error,
  };
};

export default useAgent;
