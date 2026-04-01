import axios from 'axios';
import { InquiryFormData, InquirySubmissionResponse, Lead, Product, EventItem, AdminUser, InquiryStatus } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ── Authentication API ──
export const login = async (username: string, password: string): Promise<{ token: string; user: AdminUser }> => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  localStorage.setItem('admin_token', res.data.token);
  localStorage.setItem('admin_user', JSON.stringify(res.data.user));
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getCurrentUser = (): AdminUser | null => {
  const user = localStorage.getItem('admin_user');
  return user ? JSON.parse(user) : null;
};

// ── Products API (CRUD) ──
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

export const addProduct = async (product: any): Promise<Product> => {
  const formData = new FormData();
  Object.keys(product).forEach(key => {
    if (product[key] !== undefined) formData.append(key, product[key]);
  });
  const res = await axios.post(`${API_URL}/products`, formData, getAuthHeaders());
  return res.data;
};

export const updateProduct = async (id: string, data: any): Promise<Product> => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) formData.append(key, data[key]);
  });
  const res = await axios.put(`${API_URL}/products/${id}`, formData, getAuthHeaders());
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`, getAuthHeaders());
};

// ── Events API (CRUD) ──
export const fetchEvents = async (): Promise<EventItem[]> => {
  const res = await axios.get(`${API_URL}/events`);
  return res.data;
};

export const addEvent = async (event: any): Promise<EventItem> => {
  const formData = new FormData();
  Object.keys(event).forEach(key => {
    if (event[key] !== undefined) formData.append(key, event[key]);
  });
  const res = await axios.post(`${API_URL}/events`, formData, getAuthHeaders());
  return res.data;
};

export const updateEvent = async (id: string, data: any): Promise<EventItem> => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) formData.append(key, data[key]);
  });
  const res = await axios.put(`${API_URL}/events/${id}`, formData, getAuthHeaders());
  return res.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/events/${id}`, getAuthHeaders());
};

// ── Inquiry API (CRUD & Tracking) ──
export const fetchInquiries = async (): Promise<Lead[]> => {
  const res = await axios.get(`${API_URL}/inquiries`, getAuthHeaders());
  return res.data;
};

export const submitInquiry = async (data: InquiryFormData): Promise<InquirySubmissionResponse> => {
  const res = await axios.post(`${API_URL}/inquiries`, data);
  return { id: res.data._id, success: true, message: 'Inquiry submitted', timestamp: res.data.createdAt };
};

export const updateInquiryStatus = async (id: string, status: InquiryStatus): Promise<Lead> => {
  const res = await axios.put(`${API_URL}/inquiries/${id}`, { status }, getAuthHeaders());
  return res.data;
};

export const deleteInquiry = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/inquiries/${id}`, getAuthHeaders());
};

// ── Admin Management API ──
export const fetchAdmins = async (): Promise<AdminUser[]> => {
  const res = await axios.get(`${API_URL}/admins`, getAuthHeaders());
  return res.data;
};

export const addAdmin = async (admin: any): Promise<AdminUser> => {
  const res = await axios.post(`${API_URL}/admins`, admin, getAuthHeaders());
  return res.data;
};

export const updateAdmin = async (id: string, data: any): Promise<AdminUser> => {
  const res = await axios.put(`${API_URL}/admins/${id}`, data, getAuthHeaders());
  return res.data;
};

export const updateAdminProfile = async (id: string, data: any): Promise<{ user: AdminUser, token: string }> => {
  const res = await axios.put(`${API_URL}/admins/${id}/profile`, data, getAuthHeaders());
  localStorage.setItem('admin_token', res.data.token);
  localStorage.setItem('admin_user', JSON.stringify(res.data.user));
  return res.data;
};

export const updateAdminPassword = async (id: string, password: string): Promise<void> => {
  await axios.put(`${API_URL}/admins/${id}/password`, { password }, getAuthHeaders());
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admins/${id}`, getAuthHeaders());
};

// ── Media API (Gallery CRUD) ──
export const fetchMedia = async (params?: any): Promise<any[]> => {
  const res = await axios.get(`${API_URL}/media`, { params });
  return res.data;
};

export const addMedia = async (data: any): Promise<any> => {
  const res = await axios.post(`${API_URL}/media`, data, getAuthHeaders());
  return res.data;
};

export const updateMedia = async (id: string, data: any): Promise<any> => {
  const res = await axios.put(`${API_URL}/media/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/media/${id}`, getAuthHeaders());
};


