import { useScrollReveal } from '@/hooks/useScrollReveal';
import AnimatedCounter from './AnimatedCounter';
import aboutImg from '@/assets/about-legacy.jpg';

const stats = [
  { value: 40, suffix: '+', label: 'Years of Legacy' },
  { value: 4000, suffix: '+', label: 'Trusted Dealers' },
  { value: 700, suffix: '+', label: 'Products Crafted' },
  { value: 25, suffix: '+', label: 'States Covered' },
];

export default function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="relative py-32 section-gradient" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="reveal-left relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={aboutImg}
                alt="Sonny Fireworks manufacturing facility"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-deep/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-body tracking-wider uppercase">
                  Since 1982
                </span>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div>
            <div className="reveal">
              <span className="text-xs font-body text-primary tracking-widest uppercase">Our Heritage</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-6 leading-[1.1]">
                Four Decades of
                <span className="glow-text-gold block">Pyrotechnic Mastery</span>
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-8 max-w-lg">
                From a small workshop in Sivakasi to becoming one of India's most trusted fireworks manufacturers,
                Sonny Fireworks has illuminated millions of celebrations. Every product carries the precision
                of master craftsmen and the joy of four decades of festive tradition.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 stagger-children">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="reveal glass-card rounded-xl p-5"
                >
                  <div className="font-display font-bold text-3xl md:text-4xl text-primary mb-1">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
