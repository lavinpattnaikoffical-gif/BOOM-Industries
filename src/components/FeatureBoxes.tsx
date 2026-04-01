import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';
import { Phone, Sparkle, Play } from 'lucide-react';

interface FeatureBoxesProps {
  onInquiryClick?: () => void;
  onProductsClick?: () => void;
  onMediaClick?: () => void;
}

const features = [
  {
    icon: Phone,
    title: 'Get a Quote',
    description: 'Planning an event or stocking up? Get personalized pricing tailored to your budget. Retail, bulk, or event — we have the best rates in Latur.',
    cta: 'Inquire Now →',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.2)',
    cardClass: 'boom-card-red',
    action: 'contact',
  },
  {
    icon: Sparkle,
    title: 'Our Products',
    description: 'Explore our wide range of fireworks — Factory, Bomb, Flower Pot, Chakkar, 9 cm & more. High quality, best prices.',
    cta: 'Browse Catalog →',
    color: '#f5b800',
    glowColor: 'rgba(245,184,0,0.2)',
    cardClass: 'boom-card-yellow',
    action: 'products',
  },
  {
    icon: Play,
    title: 'Watch Our Work',
    description: "Watch our spectacular firework displays and event highlights. See why Boom Industries lights up Latur's biggest celebrations.",
    cta: 'Open Gallery →',
    color: '#16a34a',
    glowColor: 'rgba(22,163,74,0.2)',
    cardClass: 'boom-card-green',
    action: 'gallery',
  },
];

export default function FeatureBoxes({ onInquiryClick, onProductsClick, onMediaClick }: FeatureBoxesProps) {
  const ref = useScrollReveal();

  const handleAction = (action: string) => {
    if (action === 'contact') onInquiryClick?.();
    else if (action === 'products') onProductsClick?.();
    else if (action === 'gallery') onMediaClick?.();
  };

  return (
    <section
      className="relative py-24"
      ref={ref}
      style={{ background: '#131319' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl"
             style={{ background: 'radial-gradient(ellipse, rgba(245,184,0,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="container mx-auto px-5 relative">
        {/* Section Header */}
        <div className="text-center mb-14 reveal">
          <span className="boom-pill mb-4">What We Offer</span>
          <h2
            className="font-display font-bold mt-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#f9f5fd' }}
          >
            Everything You Need for a{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ef4444, #f5b800, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Brilliant Celebration
            </span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`reveal ${feat.cardClass} p-7 cursor-pointer`}
              onClick={() => handleAction(feat.action)}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{
                  background: feat.glowColor,
                  border: `1px solid ${feat.color}30`,
                  boxShadow: `0 0 20px ${feat.glowColor}`,
                }}
              >
                <feat.icon className="w-8 h-8" style={{ color: feat.color }} />
              </div>

              {/* Content */}
              <h3
                className="font-display font-bold text-xl mb-3"
                style={{ color: '#f9f5fd' }}
              >
                {feat.title}
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-6"
                style={{ color: 'rgba(172,170,177,0.9)' }}
              >
                {feat.description}
              </p>

              {/* CTA */}
              <span
                className="font-display font-bold text-sm tracking-wide"
                style={{ color: feat.color }}
              >
                {feat.cta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
