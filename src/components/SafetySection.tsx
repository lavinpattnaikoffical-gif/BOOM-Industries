import { useScrollReveal } from '@/hooks/useScrollReveal';

const tips = [
  { emoji: '🚨', title: 'Keep Distance', desc: 'Stay at least 5 metres away from lit fireworks at all times.', color: '#ef4444' },
  { emoji: '🚫', title: 'No Enclosed Spaces', desc: 'Never light fireworks indoors or near flammable materials.', color: '#f97316' },
  { emoji: '👨‍👩‍👧', title: 'Adult Supervision', desc: 'Children must always be supervised by responsible adults.', color: '#f5b800' },
  { emoji: '💧', title: 'Keep Water Ready', desc: 'Always have a bucket of water nearby when lighting fireworks.', color: '#7eafff' },
];

const certifications = [
  { icon: '✅', label: 'PESO Licensed' },
  { icon: '🏆', label: 'Quality Assured' },
  { icon: '🛡️', label: 'Safety Compliant' },
  { icon: '📋', label: 'DIPP Regulated' },
];

export default function SafetySection() {
  const ref = useScrollReveal();

  return (
    <section id="safety" className="relative py-24" ref={ref}
             style={{ background: '#131319' }}>
      <div className="container mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="boom-pill" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Safety First
          </span>
          <h2 className="font-display font-bold mt-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#f9f5fd' }}>
            Always Use Fireworks{' '}
            <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Responsibly
            </span>
          </h2>
        </div>

        {/* Tips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 stagger-children">
          {tips.map(tip => (
            <div key={tip.title} className="reveal boom-card p-6 rounded-2xl text-center cursor-default"
                 style={{ border: `1px solid ${tip.color}20`, transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s' }}
                 onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${tip.color}45`; el.style.boxShadow = `0 0 24px ${tip.color}18`; el.style.transform = 'translateY(-4px)'; }}
                 onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${tip.color}20`; el.style.boxShadow = ''; el.style.transform = 'translateY(0)'; }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl"
                   style={{ background: `${tip.color}12`, border: `1px solid ${tip.color}28` }}>
                {tip.emoji}
              </div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#f9f5fd' }}>{tip.title}</h3>
              <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(172,170,177,0.85)' }}>{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="reveal rounded-2xl px-8 py-5 flex flex-wrap items-center justify-center gap-6"
             style={{ background: 'rgba(25,25,31,0.7)', border: '1px solid rgba(72,71,77,0.2)' }}>
          <span className="text-xs font-display font-bold tracking-widest uppercase"
                style={{ color: 'rgba(172,170,177,0.6)' }}>Our Standards</span>
          {certifications.map(c => (
            <div key={c.label} className="flex items-center gap-2">
              <span className="text-lg">{c.icon}</span>
              <span className="text-sm font-display font-semibold" style={{ color: '#f9f5fd' }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
