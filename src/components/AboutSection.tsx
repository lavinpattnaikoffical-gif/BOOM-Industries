import { useScrollReveal } from '@/hooks/useScrollReveal';
import AnimatedCounter from './AnimatedCounter';
import aboutImg from '@/assets/about-legacy.jpg';

const stats = [
  { value: 700,  suffix: '+', label: 'Firework Varieties', color: '#ef4444' },
  { value: 1000, suffix: '+', label: 'Happy Customers',    color: '#f5b800' },
  { value: 15,   suffix: '+', label: 'Years in Business',  color: '#16a34a' },
  { value: 50,   suffix: '+', label: 'Districts Served',   color: '#7eafff' },
];

export default function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="relative py-24" ref={ref} style={{ background: '#0e0e13' }}>
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(239,68,68,0.03) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-5 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="reveal-left relative">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 50px rgba(239,68,68,0.08), 0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <img
                src={aboutImg}
                alt="Boom Industries manufacturing"
                className="w-full object-cover"
                style={{ height: '440px' }}
              />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(to top, rgba(14,14,19,0.9) 0%, transparent 60%)' }} />
              <div className="absolute bottom-5 left-5">
                <span className="boom-pill">Latur, Maharashtra</span>
              </div>
            </div>
            {/* Glows */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(239,68,68,0.08)' }} />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-3xl" style={{ background: 'rgba(245,184,0,0.08)' }} />
          </div>

          {/* Content */}
          <div className="reveal">
            <span className="text-xs font-display font-bold tracking-widest uppercase" style={{ color: '#f5b800' }}>
              Our Legacy
            </span>
            <h2 className="font-display font-bold mt-3 mb-4 leading-[1.1]"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f9f5fd' }}>
              Lighting up your <br />
              <span style={{
                background: 'linear-gradient(135deg, #ef4444, #f5b800)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Celebrations
              </span> Since Decades
            </h2>
            <div className="space-y-4 font-body leading-relaxed mb-8" style={{ color: 'rgba(172,170,177,0.95)', fontSize: '1rem' }}>
              <p>
                Welcome to <strong style={{ color: '#f9f5fd' }}>BOOM Industries (BFW)</strong>, India's most trusted name in the world of pyrotechnics. For decades, we have been at the forefront of manufacturing and supplying high-quality fireworks that make every occasion unforgettable.
              </p>
              <p>
                Our commitment to safety, innovation, and "The Big Boom" has made us the preferred choice for thousands of families and event organizers across the region.
              </p>
            </div>

            {/* Contact info */}
            <div className="flex flex-wrap gap-3 mb-10">
              <a href="tel:9922097669"
                 className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm"
                 style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80' }}>
                📞 9922097669
              </a>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm"
                   style={{ background: 'rgba(245,184,0,0.12)', border: '1px solid rgba(245,184,0,0.3)', color: '#f5b800' }}>
                📍 Latur, Maharashtra
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 stagger-children">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-display font-bold mb-1" style={{ color: '#ef4444' }}>1000+</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Happy Customers</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-display font-bold mb-1" style={{ color: '#f5b800' }}>30+</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
