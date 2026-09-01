import { InquiryFormData, InquirySubmissionResponse } from '@/types';

// Re-exports submitInquiry from the main API module
// Kept for backward compatibility with components that import from this file

export const submitInquiry = async (data: InquiryFormData | Record<string, any>): Promise<InquirySubmissionResponse> => {
  const res = await fetch('/api/send-inquiry', {
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
