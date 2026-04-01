// Inquiry Cart Items
export interface InquiryItem {
  productId: string;
  productName: string;
  category: string;
  price: string;
  quantity: number;
}

// Form Data
export interface InquiryFormData {
  name: string;
  phone: string;
  city?: string;
  requirement: 'Retail' | 'Bulk' | 'Event' | 'Corporate';
  items: InquiryItem[];
  message?: string;
}

// API Response
export interface InquirySubmissionResponse {
  id: string;
  success: boolean;
  message: string;
  timestamp: string;
}

// Admin User Type
export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

// Product Type (extended for CRUD)
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  rating?: string;
  description?: string;
  inStock?: boolean;
  createdAt?: string;
}

// Event Type (extended for CRUD)
export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt?: string;
}

// Inquiry Status
export type InquiryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

// Admin Lead Type
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  requirement: string;
  items: InquiryItem[];
  message?: string;
  createdAt: string;
  status: InquiryStatus;
  notes?: string;
}
