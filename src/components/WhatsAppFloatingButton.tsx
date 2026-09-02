import WhatsAppIcon from './WhatsAppIcon';

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/919920976669?text=Hello!%20I%20want%20to%20inquire%20about%20fireworks."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 group overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        boxShadow: '0 0 24px rgba(37, 211, 102, 0.5)',
      }}
      title="Chat with us on WhatsApp"
      aria-label="WhatsApp Chat"
    >
      <span className="absolute -inset-1 rounded-full bg-green-500 opacity-30 animate-ping pointer-events-none" />
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <WhatsAppIcon className="w-8 h-8 text-white relative z-10" />
    </a>
  );
}
