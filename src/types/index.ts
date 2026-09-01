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

// Product Type
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

// Event Type
export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}
