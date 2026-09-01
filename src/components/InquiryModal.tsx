import { useState, useEffect } from 'react';
import { X, Phone, User, MapPin, Package, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInquiryCart } from '@/contexts/InquiryContext';
import { submitInquiry } from '@/api/admin';
import { sendInquiryViaEmail } from '@/utils/mailHelper';

// WhatsApp business number (update with your number)
const WHATSAPP_NUMBER = '919922097669';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const requirements = [
  { value: '', label: 'Select Requirement Type' },
  { value: 'retail',       label: '🛒 Retail Purchase' },
  { value: 'bulk',         label: '📦 Bulk / Wholesale Order' },
  { value: 'event',        label: '🎆 Event / Celebration' },
];

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', requirement: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { items, removeItem, clearCart } = useInquiryCart();

  // Close on ESC
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);

    const reqLabel = requirements.find(r => r.value === form.requirement)?.label || form.requirement || 'General';

    // Build WhatsApp message
    let waMessage = `*New Inquiry via Website*\n\n`;
    waMessage += `*Name:* ${form.name}\n`;
    waMessage += `*Phone:* ${form.phone}\n`;
    if (form.city) waMessage += `*City:* ${form.city}\n`;
    waMessage += `*Type:* ${reqLabel}\n\n`;

    if (items.length > 0) {
      waMessage += `*Selected Products:*\n`;
      items.forEach((item, idx) => {
        waMessage += `${idx + 1}. ${item.productName} (${item.quantity} units)\n`;
      });
      waMessage += `\n`;
    }

    // 1. Forward inquiry via Gmail / Email client
    sendInquiryViaEmail({
      name: form.name,
      phone: form.phone,
      city: form.city,
      requirement: reqLabel,
      items: items,
      message: items.length > 0 ? `Selected Cart: ${items.map(i => `${i.productName} (${i.quantity})`).join(', ')}` : 'Product Quote Request'
    });

    // 2. Also send to serverless API in background if online
    submitInquiry({
      name: form.name,
      phone: form.phone,
      city: form.city,
      requirement: reqLabel,
      items: items,
      message: items.length > 0 ? `Cart: ${items.map(i => i.productName).join(', ')}` : 'Inquiry'
    } as any).catch(err => console.log('API notification logged:', err));

    toast({
      title: '✉️ Gmail Opened with Inquiry!',
      description: 'Your inquiry has been prepared in your email. Simply click Send!',
    });

    setForm({ name: '', phone: '', city: '', requirement: '' });
    clearCart();
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div
          className="flex items-start justify-between p-6 pb-4"
          style={{ borderBottom: '1px solid rgba(72,71,77,0.25)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎆</span>
              <h2 className="font-display font-bold text-xl" style={{ color: '#f9f5fd' }}>
                Get a Quote
              </h2>
            </div>
            <p className="text-sm font-body" style={{ color: 'rgba(172,170,177,0.85)' }}>
              Fill in your details and we'll get back with the best prices!
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg transition-all duration-200"
            style={{ background: 'rgba(72,71,77,0.2)', color: '#acaab1' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(72,71,77,0.2)'; (e.currentTarget as HTMLElement).style.color = '#acaab1'; }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Product Items List (Added) */}
          {items.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h3 className="text-sm font-display font-bold text-primary mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Selected Products ({items.length})
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.category} • {item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-display font-semibold mb-1.5" style={{ color: '#f9f5fd' }}>
                <User className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" style={{ color: '#f5b800' }} />
                Your Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rajesh Kumar"
                className="boom-input"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-display font-semibold mb-1.5" style={{ color: '#f9f5fd' }}>
                <Phone className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" style={{ color: '#f5b800' }} />
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                type="tel"
                className="boom-input"
                inputMode="numeric"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.phone}</p>
              )}
            </div>

            {/* City (optional) */}
            <div>
              <label className="block text-sm font-display font-semibold mb-1.5" style={{ color: 'rgba(172,170,177,0.85)' }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" style={{ color: '#acaab1' }} />
                City <span className="text-xs font-normal">(optional)</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Latur, Nanded, Aurangabad..."
                className="boom-input"
              />
            </div>

            {/* Requirement dropdown */}
            <div>
              <label className="block text-sm font-display font-semibold mb-1.5" style={{ color: 'rgba(172,170,177,0.85)' }}>
                <Package className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" style={{ color: '#acaab1' }} />
                Requirement Type <span className="text-xs font-normal">(optional)</span>
              </label>
              <div className="relative">
                <select
                  name="requirement"
                  value={form.requirement}
                  onChange={handleChange}
                  className="boom-select"
                >
                  {requirements.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                     style={{ color: '#acaab1' }}>
                  ▾
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-boom-primary py-3.5 text-base flex items-center justify-center gap-2"
                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                ) : (
                   <><MessageSquare className="w-5 h-5" /> Submit Request</>
                )}
              </button>
            </div>

            {/* Note */}
            <p className="text-center text-xs font-body" style={{ color: 'rgba(172,170,177,0.65)' }}>
              📞 Or call us directly:{' '}
              <a href="tel:9922097669" style={{ color: '#4ade80' }}>9922097669</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
