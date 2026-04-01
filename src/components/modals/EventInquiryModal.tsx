import { useState, useEffect } from 'react';
import { X, Phone, User, Calendar, MapPin, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitInquiry } from '@/api/admin';


// WhatsApp business number (update with your number)
const WHATSAPP_NUMBER = '919876543210';

interface EventInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventInquiryModal({ isOpen, onClose }: EventInquiryModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', eventType: '', eventDate: '', location: '', budget: '', requirements: '' });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.eventType.trim()) errs.eventType = 'Event type is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    
    // Build WhatsApp message
    let message = `*Event Inquiry*\n\n`;
    message += `*Name:* ${form.name}\n`;
    message += `*Phone:* ${form.phone}\n`;
    if (form.email) message += `*Email:* ${form.email}\n`;
    message += `*Event Type:* ${form.eventType}\n`;
    if (form.eventDate) message += `*Date:* ${form.eventDate}\n`;
    message += `*Location:* ${form.location}\n`;
    if (form.budget) message += `*Budget:* ${form.budget}\n`;
    if (form.requirements) message += `*Requirements:* ${form.requirements}`;

    // Save to database
    try {
      await (submitInquiry as any)({
        name: form.name,
        phone: form.phone,
        email: form.email,
        type: 'Event',
        requirement: 'Event Planning Inquiry',
        city: form.location,
        message: `Type: ${form.eventType}. Date: ${form.eventDate}. Budget: ${form.budget}. Requirements: ${form.requirements}`
      });
    } catch (err) {
      console.error('Failed to save event inquiry to DB', err);
    }

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');


    toast({
      title: '🎉 Redirecting to WhatsApp!',
      description: 'Complete your event inquiry on WhatsApp for instant response.',
    });

    setForm({ name: '', phone: '', email: '', eventType: '', eventDate: '', location: '', budget: '', requirements: '' });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h2 className="font-display font-bold text-xl text-foreground">Plan My Event</h2>
            </div>
            <p className="text-sm font-body text-muted-foreground">Book a spectacular firework show.</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">Event Type *</label>
                <select name="eventType" value={form.eventType} onChange={handleChange} className="boom-select w-full">
                  <option value="">Select Type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festival">Festival</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Other">Other</option>
                </select>
                {errors.eventType && <p className="text-xs mt-1 text-red-500">{errors.eventType}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-primary" /> Date
                </label>
                <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} className="boom-input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-primary" /> Location *
                </label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="City/Venue" className="boom-input" />
                {errors.location && <p className="text-xs mt-1 text-red-500">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-foreground">Budget (optional)</label>
                <input name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. ₹50k" className="boom-input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Requirements</label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Tell us more about your event..." className="boom-input min-h-[60px]" />
            </div>

            <button type="submit" disabled={submitting} className="w-full btn-boom-primary py-3.5 mt-2 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><MessageSquare className="w-5 h-5" /> Send via WhatsApp</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
