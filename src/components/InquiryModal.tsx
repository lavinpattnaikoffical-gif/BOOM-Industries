import { useState, useEffect } from 'react';
import { X, Phone, User, MapPin, Package, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// WhatsApp business number (update with your number)
const WHATSAPP_NUMBER = '919876543210';

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

    // Build WhatsApp message
    let message = `*New Inquiry*\n\n`;
    message += `*Name:* ${form.name}\n`;
    message += `*Phone:* ${form.phone}\n`;
    if (form.city) message += `*City:* ${form.city}\n`;
    if (form.requirement) {
      const reqLabel = requirements.find(r => r.value === form.requirement)?.label || form.requirement;
      message += `*Requirement:* ${reqLabel}`;
    }

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: '🎆 Redirecting to WhatsApp!',
      description: 'Complete your inquiry on WhatsApp for instant response.',
    });

    setForm({ name: '', phone: '', city: '', requirement: '' });
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
        <div className="p-6">
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
                  <><MessageSquare className="w-5 h-5" /> Send via WhatsApp</>
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
