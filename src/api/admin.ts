import axios from 'axios';
import { InquiryFormData, InquirySubmissionResponse, Lead, Product, EventItem, AdminUser, InquiryStatus } from '@/types';

const API_URL = '/api';

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
  const res = await axios.post(`${API_URL}/products`, product, getAuthHeaders());
  return res.data;
};

export const updateProduct = async (id: string, data: any): Promise<Product> => {
  const res = await axios.put(`${API_URL}/products/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`, getAuthHeaders());
};

// ── Events API (CRUD) ──
export const fetchEvents = async (): Promise<EventItem[]> => {
  const res = await axios.get(`${API_URL}/media?category=Events`);
  return res.data;
};

export const addEvent = async (event: any): Promise<EventItem> => {
  const formData = new FormData();
  Object.keys(event).forEach(key => formData.append(key, event[key]));
  formData.append('category', 'Events');
  const res = await axios.post(`${API_URL}/media`, formData, getAuthHeaders());
  return res.data;
};

export const updateEvent = async (id: string, data: any): Promise<EventItem> => {
  const res = await axios.put(`${API_URL}/media/${id}`, data, getAuthHeaders());
  return res.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/media/${id}`, getAuthHeaders());
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

export const deleteAdmin = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/admins/${id}`, getAuthHeaders());
};
