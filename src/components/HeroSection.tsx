import FireworksCanvas from './FireworksCanvas';
import heroImg from '@/assets/hero-fireworks.jpg';

interface HeroSectionProps {
  onInquiryClick?: () => void;
}

export default function HeroSection({ onInquiryClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(14,14,19,0.4) 0%, rgba(14,14,19,0.25) 40%, rgba(14,14,19,0.9) 85%, #0e0e13 100%)',
          }}
        />
      </div>

      {/* Fireworks animation */}
      <FireworksCanvas />

      {/* Ambient color orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full blur-3xl opacity-20"
             style={{ background: '#ef4444', animation: 'float-y 9s ease-in-out infinite' }} />
        <div className="absolute top-1/3 right-1/5 w-56 h-56 rounded-full blur-3xl opacity-15"
             style={{ background: '#f5b800', animation: 'float-y 11s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-48 h-48 rounded-full blur-3xl opacity-15"
             style={{ background: '#16a34a', animation: 'float-y 13s ease-in-out infinite 4s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">

        {/* Brand tagline badge */}
        <div className="mb-8">
          <span className="boom-pill">
            <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: '#f5b800', animation: 'pulse-glow 2s ease-in-out infinite' }} />
            India's Finest Fireworks — Since Decades
          </span>
        </div>

        {/* Main Headline */}
        <div className="mb-4">
          <h1 className="font-display font-extrabold leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', color: '#f9f5fd' }}>
            BOOM Industries
          </h1>
          <div
            className="boom-headline font-display font-extrabold"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              lineHeight: '0.85',
              letterSpacing: '-0.02em',
              animation: 'boom-pulse 4s ease-in-out infinite',
              background: 'linear-gradient(135deg, #ef4444, #f5b800, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 15px rgba(245,184,0,0.3))'
            }}
          >
            BFW FIREWORKS
          </div>
        </div>

        {/* Sub text */}
        <p
          className="font-body text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ color: 'rgba(172,170,177,0.95)' }}
        >
          Lighting up your celebrations since decades.
          <br className="hidden sm:block" />
          India's premier fireworks manufacturers, wholesalers & retailers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 w-full sm:w-auto px-4 sm:px-0">
          <button onClick={onInquiryClick} className="btn-boom-primary text-base px-8 py-3.5 w-full sm:w-auto">
            📞 Inquire Now
          </button>
          <a href="/products" className="btn-boom-ghost text-base px-8 py-3.5 w-full sm:w-auto text-center">
            🎆 View Products
          </a>
          <a href="/gallery" className="btn-boom-ghost text-base px-8 py-3.5 w-full sm:w-auto text-center">
            📸 See Gallery
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: '🏭', text: 'Direct Manufacturers' },
            { icon: '🛡️', text: 'Safety Certified' },
            { icon: '🚚', text: 'Pan India Supply' },
            { icon: '📦', text: 'Wholesale & Retail' },
          ].map(badge => (
            <div key={badge.text} className="trust-badge">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0e0e13, transparent)' }}
      />
    </section>
  );
}
