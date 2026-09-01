import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Instagram, Send, MessageSquare, Clock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SparkCursor from '@/components/SparkCursor';
import EmberParticles from '@/components/EmberParticles';
import { sendInquiryViaEmail } from '@/utils/mailHelper';

// WhatsApp business number (update with your number)
const WHATSAPP_NUMBER = '919876543210';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: 'Missing fields', description: 'Name and phone are required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    // Build WhatsApp message
    let message = `*Contact Form Inquiry*\n\n`;
    message += `*Name:* ${form.name}\n`;
    message += `*Phone:* ${form.phone}\n`;
    if (form.message) message += `*Message:* ${form.message}`;

    // Open Gmail / Mail with contact message
    sendInquiryViaEmail({
      name: form.name,
      phone: form.phone,
      requirement: 'Website Contact Form Message',
      message: form.message
    });

    toast({
      title: '✉️ Gmail Opened with Your Message!',
      description: 'Your message has been prefilled in your email. Simply click Send!',
    });
    
    setForm({ name: '', phone: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">Get in <span className="glow-text-multi">Touch</span></h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about products or events? We're here to help you light up your celebrations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 md:p-10 rounded-3xl border border-white/5"
            >
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary w-6 h-6" /> Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Name</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="boom-input w-full" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="boom-input w-full" 
                    placeholder="Enter 10-digit number" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</label>
                  <textarea 
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="boom-input w-full min-h-[120px]" 
                    placeholder="How can we help you?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-boom-primary w-full py-4 text-base flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Our Location</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      In front of Rajmata School, Sale Galli, Gunjgolai, Latur – 413 512
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-green-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Contact Number</h3>
                    <p className="text-muted-foreground text-sm">9920976669</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Email Us</h3>
                    <a href="mailto:Boomindustries26@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      Boomindustries26@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Instagram className="text-red-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Instagram</h3>
                    <p className="text-muted-foreground text-sm">@boom_fireworks_official</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Business Hours</h3>
                    <p className="text-muted-foreground text-sm">Open 7 Days (9:00 AM – 9:00 PM)</p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-64 rounded-3xl overflow-hidden border border-white/5 grayscale invert opacity-70 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-500">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.444444444444!2d76.5833333!3d18.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf8392aaaaaaab%3A0xaaaaaaaaaaaaaaaa!2sSale%20Galli%2C%20Latur!5e0!3m2!1sen!2sin!4v1234567890" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
