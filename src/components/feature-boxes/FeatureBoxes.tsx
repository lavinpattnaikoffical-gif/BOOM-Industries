import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ShoppingBag, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}

const FeatureBox = ({ icon, title, description, onClick, delay }: FeatureBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group glass-card glass-card-hover rounded-2xl p-8 cursor-pointer relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center transition-all duration-300"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-ember/10 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-ember/5 rounded-full blur-3xl -z-10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 bg-primary/5"
        >
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary"
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Title */}
        <h3 className="font-display font-bold text-2xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed max-w-xs">
          {description}
        </p>

        {/* Arrow indicator */}
        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
        >
          <span>Explore</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Glow border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-primary via-ember to-primary bg-[length:200%_auto] opacity-0 group-hover:opacity-50 -z-10"
        style={{
          backgroundClip: 'padding-box',
          borderImage: 'linear-gradient(135deg, rgb(255, 193, 7), rgb(255, 87, 145), rgb(255, 193, 7)) 1',
        }}
      />
    </motion.div>
  );
};

interface FeatureBoxesProps {
  onContactClick: () => void;
}

export default function FeatureBoxes({ onContactClick }: FeatureBoxesProps) {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  const boxes = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Submit Inquiry',
      description: 'Tell us your fireworks requirements and let our team help you find the perfect products for your celebration.',
      onClick: onContactClick,
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Explore Products',
      description: 'Browse our extensive catalog of premium fireworks across different categories and price ranges.',
      onClick: () => navigate('/products'),
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: 'View Gallery',
      description: 'Watch our fireworks in action through stunning photos and videos from celebrations across India.',
      onClick: () => navigate('/gallery'),
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-body text-primary tracking-widest uppercase">
            Quick Access
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">
            <span className="text-foreground">Explore Our</span>
            <span className="block glow-text-gold mt-2">Premium Experience</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Discover fireworks that light up celebrations. Submit your inquiry, browse our products, or see them in action.
          </p>
        </div>

        {/* Feature boxes grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {boxes.map((box, index) => (
            <FeatureBox
              key={box.title}
              {...box}
              delay={index * 0.15}
            />
          ))}
        </div>

        {/* Bottom accent */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground/60 font-body">
            Not sure which option to choose? <span className="text-primary font-semibold">Contact us</span> and our experts will guide you!
          </p>
        </div>
      </div>
    </section>
  );
}
