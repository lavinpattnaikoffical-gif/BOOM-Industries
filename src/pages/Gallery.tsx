import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EmberParticles from '@/components/EmberParticles';
import SparkCursor from '@/components/SparkCursor';
import Footer from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { GALLERY_ITEMS, GalleryItem } from '@/data/gallery';



const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'image', label: 'Photos' },
  { value: 'event', label: 'Events' },
];

interface LightboxProps {
  item: GalleryItem;
  allItems: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({ item, allItems, onClose, onNext, onPrev }: LightboxProps) => {
  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const itemCount = allItems.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] bg-night-deep rounded-2xl overflow-hidden border border-primary/20"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-night-deep/80 border border-primary/30 text-foreground hover:text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="flex items-center justify-center bg-night-deep w-full h-full">
          {item.type === 'image' ? (
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className={`w-full ${item.videoPlatform === 'instagram' ? 'h-full max-w-[400px]' : 'aspect-video'}`}>
              <iframe
                width="100%"
                height="100%"
                src={
                  item.videoPlatform === 'instagram'
                    ? `https://www.instagram.com/reel/${item.videoId}/embed`
                    : `https://www.youtube.com/embed/${item.videoId}`
                }
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={item.videoPlatform === 'instagram' ? 'rounded-xl' : ''}
              />
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-night-deep to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground/80">
                {item.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground/60">
              {currentIndex + 1} / {itemCount}
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-night-deep/80 border border-primary/30 text-foreground hover:text-primary transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-night-deep/80 border border-primary/30 text-foreground hover:text-primary transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  );
};

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

const GalleryCard = ({ item, onClick }: GalleryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-100px' }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer h-64 glass-card glass-card-hover"
    >
      {/* Image/Video Thumbnail */}
      <img
        src={item.thumbnail || item.src}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent opacity-60" />

      {/* Video Play Button */}
      {item.type === 'video' && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <Play className="w-8 h-8 text-primary fill-primary" />
          </div>
        </motion.div>
      )}

      {/* Info Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-ember/10 to-transparent flex flex-col justify-end p-4"
      >
        <h3 className="font-display font-bold text-lg text-foreground mb-1">
          {item.title}
        </h3>
        <span className="text-xs text-primary font-semibold uppercase tracking-wider">
          {item.category.replace('-', ' ')}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default function Gallery() {
  const ref = useScrollReveal();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const items = GALLERY_ITEMS;


  const filtered =
    selectedCategory === 'all'
      ? items
      : selectedCategory === 'video' || selectedCategory === 'image'
      ? items.filter((item) => item.type === selectedCategory)
      : items.filter((item) => item.category === selectedCategory);


  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filtered.findIndex((i) => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filtered.length;
    setSelectedItem(filtered[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filtered.findIndex((i) => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    setSelectedItem(filtered[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center mb-12"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="font-display font-bold text-5xl md:text-6xl leading-[0.9] tracking-tight mb-6">
              <span className="text-foreground">Gallery of</span>
              <span className="block glow-text-multi mt-2">Celebrations</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the magic of fireworks through stunning photos and videos from events across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-8 border-b border-border/20" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="reveal flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground glow-sm'
                    : 'bg-night-surface text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm text-muted-foreground/60 mt-6 text-center reveal"
          >
            Showing {filtered.length} of {items.length} items
          </motion.p>

        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  layoutId={item.id}
                >
                  <GalleryCard
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox
            item={selectedItem}
            allItems={filtered}
            onClose={() => setSelectedItem(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
