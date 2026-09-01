/**
 * Utility to open Gmail / default mail client with prefilled inquiry details.
 */

// Target business email address where inquiries will be directed
export const BUSINESS_EMAIL = 'Boomindustries26@gmail.com';

interface MailInquiryData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  requirement?: string;
  items?: Array<{
    productName: string;
    quantity: number;
    price?: string;
    category?: string;
  }>;
  message?: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  budget?: string;
}

/**
 * Generates email subject & body text and launches Gmail / default email client
 */
export function sendInquiryViaEmail(data: MailInquiryData): void {
  const subject = `🎆 BOOM Fireworks Inquiry: ${data.eventType || data.requirement || 'Order Quote'} - ${data.name}`;

  let body = `Hello BOOM Industries (BFW Fireworks),\n\n`;
  body += `I would like to submit an inquiry with the following details:\n\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `👤 CUSTOMER INFORMATION\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `• Name: ${data.name}\n`;
  body += `• Phone: ${data.phone}\n`;
  if (data.email) body += `• Email: ${data.email}\n`;
  if (data.city || data.location) body += `• Location/City: ${data.city || data.location}\n`;
  if (data.requirement) body += `• Requirement Type: ${data.requirement}\n`;

  if (data.eventType) {
    body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `🎉 EVENT DETAILS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `• Event Type: ${data.eventType}\n`;
    if (data.eventDate) body += `• Date: ${data.eventDate}\n`;
    if (data.location) body += `• Venue / Location: ${data.location}\n`;
    if (data.budget) body += `• Budget: ${data.budget}\n`;
  }

  if (data.items && data.items.length > 0) {
    body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `🛒 SELECTED PRODUCTS (${data.items.length} items)\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    data.items.forEach((item, index) => {
      body += `${index + 1}. ${item.productName} - Qty: ${item.quantity} ${item.price ? `(${item.price})` : ''}\n`;
    });
  }

  if (data.message) {
    body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `💬 ADDITIONAL NOTES / MESSAGE\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `${data.message}\n`;
  }

  body += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `Looking forward to your response & quote.\n`;
  body += `Thank you!\n`;

  // 1. Gmail Web Direct Compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(BUSINESS_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // 2. Standard mailto fallback
  const mailtoUrl = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Try opening Gmail web composer in a new tab
  const win = window.open(gmailUrl, '_blank');
  
  // If popup blocked or on mobile device fallback, trigger mailto
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = mailtoUrl;
  }
}
