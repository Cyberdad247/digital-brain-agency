import { useState, useCallback } from 'react';
import axios from 'axios';

const N8N_API_URL = 'http://localhost:5678/rest'; // Adjust as needed

export const useN8n = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${N8N_API_URL}/workflows`);
      setLoading(false);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch workflows');
      setLoading(false);
      return [];
    }
  }, []);

  const toggleWorkflow = useCallback(async (id: string, active: boolean) => {
    setLoading(true);
    try {
      await axios.patch(`${N8N_API_URL}/workflows/${id}`, { active: !active });
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to toggle workflow');
      setLoading(false);
      return false;
    }
  }, []);

  return { loading, error, fetchWorkflows, toggleWorkflow };
};
