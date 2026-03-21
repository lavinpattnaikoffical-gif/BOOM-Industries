import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useInquiryCart } from '@/contexts/InquiryContext';
import Navbar from '@/components/Navbar';
import EmberParticles from '@/components/EmberParticles';
import SparkCursor from '@/components/SparkCursor';
import Footer from '@/components/Footer';
import productSparklers from '@/assets/product-sparklers.jpg';
import productRockets from '@/assets/product-rockets.jpg';
import productFountains from '@/assets/product-fountains.jpg';
import productCrackers from '@/assets/product-crackers.jpg';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  rating: string;
  description: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Golden Blaze Rockets',
    category: 'Rockets',
    image: productRockets,
    price: '₹450',
    rating: '4.8',
    description: 'Premium rockets with golden sparks and loud sound effect',
  },
  {
    id: '2',
    name: 'Royal Fountain Cone',
    category: 'Fountains',
    image: productFountains,
    price: '₹320',
    rating: '4.9',
    description: 'Elegant fountain with cascading sparks',
  },
  {
    id: '3',
    name: 'Premium Sparkler Box',
    category: 'Sparklers',
    image: productSparklers,
    price: '₹180',
    rating: '4.7',
    description: 'Safe and bright sparklers for all ages',
  },
  {
    id: '4',
    name: 'Festival Cracker Pack',
    category: 'Crackers',
    image: productCrackers,
    price: '₹550',
    rating: '4.6',
    description: 'Loud crackers perfect for celebrations',
  },
  {
    id: '5',
    name: 'Sky Commander Multi-Shot',
    category: 'Rockets',
    image: productRockets,
    price: '₹1,200',
    rating: '4.9',
    description: 'Premium multi-shot rocket with visual effects',
  },
  {
    id: '6',
    name: 'Diamond Rain Fountain',
    category: 'Fountains',
    image: productFountains,
    price: '₹480',
    rating: '4.8',
    description: 'High-quality fountain with bright white sparks',
  },
  {
    id: '7',
    name: 'Silver Star Sparklers',
    category: 'Sparklers',
    image: productSparklers,
    price: '₹220',
    rating: '4.7',
    description: 'Long-lasting sparklers with silver glitter',
  },
  {
    id: '8',
    name: 'Thunder Strike Crackers',
    category: 'Crackers',
    image: productCrackers,
    price: '₹650',
    rating: '4.8',
    description: 'Super loud crackers with extended boom',
  },
  {
    id: '9',
    name: 'Red Comet Rocket',
    category: 'Rockets',
    image: productRockets,
    price: '₹380',
    rating: '4.7',
    description: 'Fast-flying rocket with red trail',
  },
];

const CATEGORIES = ['All', 'Rockets', 'Fountains', 'Sparklers', 'Crackers'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '₹0 - ₹300', min: 0, max: 300 },
  { label: '₹300 - ₹600', min: 300, max: 600 },
  { label: '₹600+', min: 600, max: Infinity },
];

interface ProductCardProps {
  product: Product;
  onAddToInquiry: (product: Product) => void;
  isHovered: string | null;
  setIsHovered: (id: string | null) => void;
}

const ProductCard = ({ product, onAddToInquiry, isHovered, setIsHovered }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(null);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-100px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(product.id)}
      style={{
        transformStyle: 'preserve-3d',
      } as any}
      className="group glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer perspective"
    >
      {/* Card wrapper for 3D effect */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 60 }}
        style={{
          transformStyle: 'preserve-3d',
        } as any}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-64 bg-night-surface">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent opacity-60" />

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-night-deep/70 border border-primary/20 text-xs font-body text-primary">
            ★ {product.rating}
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered === product.id ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-ember/10 to-transparent"
          />
        </div>

        {/* Content */}
        <div className="p-5 relative z-10">
          <span className="text-[11px] text-muted-foreground font-body tracking-wider uppercase">
            {product.category}
          </span>
          <h3 className="font-display font-semibold text-lg mt-2 mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground/70 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-xl text-primary">
              {product.price}
            </span>
            <span className="text-xs text-muted-foreground/60 font-body">per pack</span>
          </div>

          {/* Add to Inquiry Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToInquiry(product)}
            className="w-full py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Inquiry
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Products() {
  const ref = useScrollReveal();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useInquiryCart();
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');

  // Filter products
  let filtered = ALL_PRODUCTS.filter((p) => {
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const priceRange = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
    const price = parseFloat(p.price.replace(/[^0-9.-]+/g, ''));
    const priceMatch = price >= priceRange!.min && price <= priceRange!.max;
    return categoryMatch && priceMatch;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
      return priceB - priceA;
    });
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  const handleAddToInquiry = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      quantity: 1,
    });

    toast({
      title: 'Added to Inquiry!',
      description: `${product.name} added. View your inquiry in the navbar.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar onContactClick={() => setModalOpen(true)} />

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
              <span className="text-foreground">Our Premium</span>
              <span className="block glow-text-multi mt-2">Collection</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore 700+ fireworks crafted with precision. Add items to your inquiry and let us help you celebrate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative py-8 border-t border-b border-border/20" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="reveal grid md:grid-cols-3 gap-6"
          >
            {/* Category Filter */}
            <div>
              <label className="text-xs font-body text-primary tracking-widest uppercase mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground glow-sm'
                        : 'bg-night-surface text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="text-xs font-body text-primary tracking-widest uppercase mb-3 block">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-night-surface border border-border/50 text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-body text-primary tracking-widest uppercase mb-3 block">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-night-surface border border-border/50 text-foreground text-sm outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm text-muted-foreground/60 mt-6 reveal"
          >
            Showing {filtered.length} of {ALL_PRODUCTS.length} products
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToInquiry={handleAddToInquiry}
                      isHovered={hoveredCard}
                      setIsHovered={setHoveredCard}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground font-body text-lg">
                  No products found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriceRange('All Prices');
                  }}
                  className="mt-6 px-6 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
