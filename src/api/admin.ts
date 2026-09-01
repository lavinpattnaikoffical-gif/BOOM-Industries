import { InquiryFormData, InquirySubmissionResponse } from '@/types';

// Serverless API — inquiry submissions are sent to the Vercel serverless function
// which forwards them via email using Resend

const API_URL = '/api';

// ── Submit Inquiry (sends email via serverless function) ──
export const submitInquiry = async (data: InquiryFormData | Record<string, any>): Promise<InquirySubmissionResponse> => {
  const res = await fetch(`${API_URL}/send-inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || 'Failed to submit inquiry');
  }

  return res.json();
};
