import { z } from 'zod';

export const inquiryFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  city: z.string().optional().nullable(),
  requirement: z.enum(['Retail', 'Bulk', 'Event', 'Corporate'], {
    errorMap: () => ({ message: 'Please select a valid requirement type' })
  }),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    category: z.string(),
    price: z.string(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  })).optional().default([]),
  message: z.string().optional().nullable(),
});

export type InquiryFormSchema = z.infer<typeof inquiryFormSchema>;
