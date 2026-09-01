// Vercel Serverless Function — handles all inquiry form submissions via email
// Deploy: This file auto-becomes POST /api/send-inquiry on Vercel

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { name, phone, email, type, requirement, city, items, message, eventType, eventDate, location, budget } = body;

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: 'Name and phone are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'delivered@resend.dev';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the email HTML
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let itemsHtml = '';
    if (items && items.length > 0) {
      itemsHtml = `
        <h3 style="color: #f5b800; margin-top: 20px;">🛒 Selected Products</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
          <tr style="background: #1a1a2e; color: #f5b800;">
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">#</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Product</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Category</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Price</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #333;">Qty</th>
          </tr>
          ${items.map((item: any, i: number) => `
            <tr style="background: ${i % 2 === 0 ? '#0e0e13' : '#1a1a2e'}; color: #ccc;">
              <td style="padding: 8px; border: 1px solid #333;">${i + 1}</td>
              <td style="padding: 8px; border: 1px solid #333;">${item.productName}</td>
              <td style="padding: 8px; border: 1px solid #333;">${item.category}</td>
              <td style="padding: 8px; border: 1px solid #333;">${item.price}</td>
              <td style="padding: 8px; border: 1px solid #333;">${item.quantity}</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    // Determine inquiry type for subject line
    let inquiryType = type || requirement || 'General Inquiry';
    if (eventType) inquiryType = `Event Inquiry — ${eventType}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0e0e13; color: #f9f5fd; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f5b800, #ef4444); padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: #0e0e13;">🎆 BOOM Industries</h1>
          <p style="margin: 4px 0 0; font-size: 14px; color: #0e0e13cc;">New Inquiry Received</p>
        </div>

        <div style="padding: 24px;">
          <h2 style="color: #f5b800; margin-top: 0;">${inquiryType}</h2>
          <p style="color: #888; font-size: 12px;">Received at: ${timestamp}</p>

          <div style="background: #1a1a2e; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #f5b800; margin-top: 0;">👤 Customer Details</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #4ade80;">${phone}</a></p>
            ${email ? `<p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4ade80;">${email}</a></p>` : ''}
            ${city || location ? `<p style="margin: 4px 0;"><strong>Location:</strong> ${city || location}</p>` : ''}
            ${requirement ? `<p style="margin: 4px 0;"><strong>Requirement:</strong> ${requirement}</p>` : ''}
          </div>

          ${eventType ? `
          <div style="background: #1a1a2e; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #f5b800; margin-top: 0;">🎉 Event Details</h3>
            <p style="margin: 4px 0;"><strong>Event Type:</strong> ${eventType}</p>
            ${eventDate ? `<p style="margin: 4px 0;"><strong>Date:</strong> ${eventDate}</p>` : ''}
            ${location ? `<p style="margin: 4px 0;"><strong>Location:</strong> ${location}</p>` : ''}
            ${budget ? `<p style="margin: 4px 0;"><strong>Budget:</strong> ${budget}</p>` : ''}
          </div>
          ` : ''}

          ${itemsHtml}

          ${message ? `
          <div style="background: #1a1a2e; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #f5b800; margin-top: 0;">💬 Message</h3>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #333;">
            <a href="https://wa.me/91${phone}" style="display: inline-block; background: #25D366; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 8px;">
              📱 WhatsApp Customer
            </a>
            <a href="tel:${phone}" style="display: inline-block; background: #f5b800; color: #0e0e13; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              📞 Call Now
            </a>
          </div>
        </div>

        <div style="background: #1a1a2e; padding: 12px; text-align: center; font-size: 11px; color: #666;">
          Sent from BOOM Industries Website • BFW Fireworks
        </div>
      </div>
    `;

    // Send via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'BOOM Industries <onboarding@resend.dev>',
        to: [BUSINESS_EMAIL],
        subject: `🎆 New Inquiry: ${inquiryType} — ${name}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await resendResponse.json();

    return new Response(JSON.stringify({
      id: result.id,
      success: true,
      message: 'Inquiry submitted successfully! We will contact you soon.',
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Inquiry handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
