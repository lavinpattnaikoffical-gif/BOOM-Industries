import { MessageSquare } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/919920976669?text=Hello! I want to inquire about fireworks."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-300 hover:scale-110 group overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        boxShadow: '0 0 24px rgba(37, 211, 102, 0.4)',
      }}
      title="WhatsApp Us"
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <MessageSquare className="w-7 h-7 text-white fill-white" />
    </a>
  );
}
