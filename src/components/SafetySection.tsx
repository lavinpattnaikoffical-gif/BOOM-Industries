import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Shield, Award, Truck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Safety Certified',
    desc: 'Every product undergoes rigorous quality and safety testing under international standards.',
  },
  {
    icon: Award,
    title: 'Licensed Manufacturing',
    desc: 'Government-licensed facility in Sivakasi with complete compliance and environmental certifications.',
  },
  {
    icon: Truck,
    title: 'Secure Distribution',
    desc: 'Specialized logistics ensuring safe delivery through 4,000+ authorized dealer network.',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    desc: 'Hand-inspected batches with consistent performance, vibrant colors, and reliable ignition.',
  },
];

export default function SafetySection() {
  const ref = useScrollReveal();

  return (
    <section id="safety" className="relative py-32 section-gradient" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-body text-primary tracking-widest uppercase">Trust & Safety</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">
            Built on <span className="glow-text-gold">Trust</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Safety isn't just a standard — it's the foundation of every product we create.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {features.map((f) => (
            <div
              key={f.title}
              className="reveal glass-card glass-card-hover rounded-2xl p-6 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:glow-sm transition-shadow duration-300">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
