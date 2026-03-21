import axios, { AxiosInstance } from 'axios';
import { InquiryFormData, InquirySubmissionResponse, Lead } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Inquiry API Methods
export const submitInquiry = async (data: InquiryFormData): Promise<InquirySubmissionResponse> => {
  const response = await client.post('/inquiries', data);
  return response.data;
};

export const fetchInquiries = async (filters?: Record<string, any>): Promise<Lead[]> => {
  const response = await client.get('/inquiries', { params: filters });
  return response.data;
};

export const getInquiryById = async (id: string): Promise<Lead> => {
  const response = await client.get(`/inquiries/${id}`);
  return response.data;
};

export const updateInquiryStatus = async (id: string, status: string): Promise<Lead> => {
  const response = await client.patch(`/inquiries/${id}`, { status });
  return response.data;
};

export const addInquiryNote = async (id: string, note: string): Promise<Lead> => {
  const response = await client.patch(`/inquiries/${id}/notes`, { note });
  return response.data;
};

export const deleteInquiry = async (id: string): Promise<void> => {
  await client.delete(`/inquiries/${id}`);
};

export const exportLeadsCSV = async (filters?: Record<string, any>): Promise<Blob> => {
  const response = await client.get('/inquiries/export/csv', {
    params: filters,
    responseType: 'blob',
  });
  return response.data;
};

export const exportLeadsExcel = async (filters?: Record<string, any>): Promise<Blob> => {
  const response = await client.get('/inquiries/export/excel', {
    params: filters,
    responseType: 'blob',
  });
  return response.data;
};

// Health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await client.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

export default client;
