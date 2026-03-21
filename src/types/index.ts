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

// Admin Lead Type
export interface Lead {
  id: string;
  name: string;
  phone: string;
  city?: string;
  requirement: string;
  items: InquiryItem[];
  createdAt: string;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
  notes?: string;
}

// Gallery Item
export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: 'product' | 'event' | 'behind-scenes';
  src: string;
  thumbnail?: string;
  videoId?: string; // For YouTube embeds
  description?: string;
}

// Product Type (extended)
export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  rating?: string;
  description?: string;
  inStock?: boolean;
}
