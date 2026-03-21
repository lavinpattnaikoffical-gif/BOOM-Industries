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
                alt="Boom Fireworks manufacturing"
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
          <div>
            <div className="reveal">
              <span className="text-xs font-display font-bold tracking-widest uppercase" style={{ color: '#f5b800' }}>
                About BOOM Fireworks
              </span>
              <h2 className="font-display font-bold mt-3 mb-4 leading-[1.1]"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#f9f5fd' }}>
                Latur's Most Trusted
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444, #f5b800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Fireworks Store
                </span>
              </h2>
              <p className="font-body leading-relaxed mb-5 max-w-lg"
                 style={{ color: 'rgba(172,170,177,0.95)', fontSize: '1rem' }}>
                Based in Gunigolai, Latur, Boom Fireworks is your one-stop destination for all kinds of fireworks.
                We are manufacturers, wholesalers, traders, and retailers — offering the best prices directly to customers.
              </p>
              <p className="font-body leading-relaxed mb-8"
                 style={{ color: 'rgba(172,170,177,0.8)', fontSize: '0.95rem' }}>
                From small retail purchases to large wholesale bulk orders and event celebrations — we cater to all.
                Trusted by 1,000+ customers across Latur and surrounding districts.
              </p>

              {/* Contact info */}
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="tel:9922097669"
                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm"
                   style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80' }}>
                  📞 9922097669
                </a>
                <a href="https://instagram.com/boom_fireworks_official" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-display font-semibold text-sm"
                   style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  📸 @boom_fireworks_official
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 stagger-children">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="reveal boom-card p-4 rounded-xl"
                  style={{ border: `1px solid ${stat.color}20` }}
                >
                  <div className="font-display font-bold text-3xl mb-0.5" style={{ color: stat.color }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-body" style={{ color: 'rgba(172,170,177,0.8)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
