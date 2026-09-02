import { useState, useEffect } from 'react';
import { X, Phone, User, Package, Loader2, CheckCircle, ShoppingBag } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useToast } from '@/hooks/use-toast';
import { sendInquiryViaEmail } from '@/utils/mailHelper';


// WhatsApp business number (update with your number)
const WHATSAPP_NUMBER = '919876543210';

interface ProductInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductInquiryModal({ isOpen, onClose }: ProductInquiryModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', requirements: '', quantity: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.requirements.trim()) errs.requirements = 'Product requirements are required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    
    // Build WhatsApp message
    let message = `*Custom Product Inquiry*\n\n`;
    message += `*Name:* ${form.name}\n`;
    message += `*Phone:* ${form.phone}\n`;
    if (form.email) message += `*Email:* ${form.email}\n`;
    message += `*Requirements:* ${form.requirements}\n`;
    if (form.quantity) message += `*Quantity:* ${form.quantity}\n`;
    if (form.notes) message += `*Notes:* ${form.notes}`;

    // Forward inquiry via Gmail / Email client
    sendInquiryViaEmail({
      name: form.name,
      phone: form.phone,
      email: form.email,
      requirement: 'Custom Product Order (Bulk/Wholesale)',
      message: `Requirements: ${form.requirements}\nQuantity: ${form.quantity || 'Not specified'}\nAdditional Notes: ${form.notes || 'None'}`
    });

    toast({
      title: '✉️ Gmail Opened with Custom Order!',
      description: 'Your inquiry has been prepared in your email. Simply click Send!',
    });

    setForm({ name: '', phone: '', email: '', requirements: '', quantity: '', notes: '' });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="font-display font-bold text-xl text-foreground">Custom Product Orders</h2>
            </div>
            <p className="text-sm font-body text-muted-foreground">Order in bulk or customized quantities.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">
                  <User className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-primary" /> Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="boom-input" />
                {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-primary" /> Phone *
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="boom-input" />
                {errors.phone && <p className="text-xs mt-1 text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Email (optional)</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="boom-input" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">
                <Package className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-primary" /> Product Requirements *
              </label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Describe your requirement..." className="boom-input min-h-[80px]" />
              {errors.requirements && <p className="text-xs mt-1 text-red-500">{errors.requirements}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-muted-foreground">Quantity (optional)</label>
                <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 50 boxes" className="boom-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-muted-foreground">Additional Notes</label>
                <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any other info?" className="boom-input" />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full btn-boom-primary py-3.5 mt-2 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><WhatsAppIcon className="w-5 h-5" /> Submit Inquiry via WhatsApp</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
