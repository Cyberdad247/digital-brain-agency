import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getErrorMessage } from './errorUtils';

interface ApiClient extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const apiClient: ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message = getErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

export { apiClient };
