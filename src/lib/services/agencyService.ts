import { Agency } from '../types/agencyTypes';
import { apiClient } from '../../utils/apiClient';
import { ContentIdea } from '../types/contentTypes';

export const createAgency = async (agencyData: Agency) => {
  const response = await apiClient.post('/agencies', agencyData);
  return response.data;
};

export const updateAgency = async (id: string, agencyData: Partial<Agency>) => {
  const response = await apiClient.patch(`/agencies/${id}`, agencyData);
  return response.data;
};

export const getAgency = async (id: string) => {
  const response = await apiClient.get(`/agencies/${id}`);
  return response.data;
};

export const deleteAgency = async (id: string) => {
  await apiClient.delete(`/agencies/${id}`);
};

export const listAgencies = async () => {
  const response = await apiClient.get('/agencies');
  return response.data;
};

// Content Ideas Methods
export const getContentIdeas = async (agencyId: string): Promise<ContentIdea[]> => {
  const response = await apiClient.get(`/content-ideas?agencyId=${agencyId}`);
  return response.data;
};

export const createContentIdea = async (contentIdea: {
  title: string;
  type: string;
  status: string;
  agencyId: string;
}) => {
  const response = await apiClient.post('/content-ideas', contentIdea);
  return response.data;
};
