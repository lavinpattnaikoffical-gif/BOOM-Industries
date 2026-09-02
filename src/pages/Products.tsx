import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, ChevronLeft, Search, SlidersHorizontal, Sparkles, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useInquiryCart } from '@/contexts/InquiryContext';
import Navbar from '@/components/Navbar';
import EmberParticles from '@/components/EmberParticles';
import SparkCursor from '@/components/SparkCursor';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';
import { Product } from '@/types';
import { useProducts } from '@/contexts/ProductContext';
import { formatGoogleDriveUrl } from '@/utils/imageHelper';
import { getCategoryMeta } from '@/utils/categoryHelper';

// Helper function to get unique categories
const getCategoriesFromProducts = (products: Product[]) => {
  const cats = ['All', ...new Set(products.map((p) => p.category))];
  return cats;
};

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '₹0 - ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000+', min: 1000, max: Infinity },
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
        <div className="relative overflow-hidden h-64 bg-night-surface">
          <img
            src={formatGoogleDriveUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1533230408703-a2321476c827?auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Pill */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-display font-semibold tracking-wider uppercase bg-night-deep/80 backdrop-blur-md border border-white/10 text-primary flex items-center gap-1.5">
              <span>{getCategoryMeta(product.category).icon}</span>
              {product.category}
            </span>
          </div>

          {/* Rating Badge */}
          {product.rating && (
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-night-deep/80 backdrop-blur-md border border-white/10 text-yellow-400 flex items-center gap-1">
                ⭐ {product.rating}
              </span>
            </div>
          )}

          {/* Hover Overlay Button */}
          <div className="absolute inset-0 bg-night-deep/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToInquiry(product);
              }}
              className="btn-boom-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl"
            >
              <Plus className="w-4 h-4" /> Add to Inquiry
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Price</div>
              <div className="text-2xl font-display font-bold text-foreground">
                {product.price}
              </div>
            </div>

            <button
              onClick={() => onAddToInquiry(product)}
              className="sm:hidden p-2 rounded-xl bg-primary text-night-deep font-bold hover:scale-105 transition-transform"
              title="Add to Inquiry"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const { products } = useProducts();

  // Extract unique categories and build rich card data
  const rawCategories = ['All', ...new Set(products.map((p) => p.category))];
  const categoriesWithCounts = rawCategories.map((cat) => {
    const meta = cat === 'All' 
      ? { icon: '✨', subtitle: 'View complete 700+ fireworks catalog', color: '#f5b800' }
      : getCategoryMeta(cat);
    const count = cat === 'All' 
      ? products.length 
      : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
    return {
      name: cat,
      icon: meta.icon,
      subtitle: meta.subtitle,
      color: meta.color,
      count,
    };
  });

  // Filter products
  const filtered = products.filter((p) => {
    const categoryMatch = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    // Safely parse numeric price
    const rawPriceNum = parseFloat((p.price || '').toString().replace(/[^0-9.]/g, ''));
    const price = isNaN(rawPriceNum) ? 0 : rawPriceNum;
    
    const priceRange = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
    const priceMatch = 
      selectedPriceRange === 'All Prices' || 
      (price >= (priceRange?.min ?? 0) && price <= (priceRange?.max ?? Infinity));

    const searchMatch = !searchTerm || (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && priceMatch && searchMatch;
  });

  // Sort products safely
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => {
      const priceA = parseFloat((a.price || '').toString().replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat((b.price || '').toString().replace(/[^0-9.]/g, '')) || 0;
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => {
      const priceA = parseFloat((a.price || '').toString().replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat((b.price || '').toString().replace(/[^0-9.]/g, '')) || 0;
      return priceB - priceA;
    });
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => {
      const ratingA = parseFloat(a.rating || '4.5') || 0;
      const ratingB = parseFloat(b.rating || '4.5') || 0;
      return ratingB - ratingA;
    });
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

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar onContactClick={() => setModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center mb-8"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[0.9] tracking-tight mb-4">
              <span className="text-foreground">Our Premium</span>
              <span className="block glow-text-multi mt-2">Fireworks Collection</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore 700+ fireworks crafted with precision. Browse by category, add items to your inquiry list, and get fast WhatsApp quotes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Visual Category Section ── */}
      <section className="relative py-8 sm:py-12 border-t border-white/10 bg-night-deep/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-display font-bold tracking-widest uppercase text-primary mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explore Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Browse By Category
              </h2>
            </div>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  scrollToProducts();
                }}
                className="text-xs font-display font-bold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5"
              >
                Showing: {selectedCategory} (Click to Show All ✕)
              </button>
            )}
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categoriesWithCounts.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <motion.div
                  key={cat.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    scrollToProducts();
                  }}
                  className={`group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden border ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary shadow-xl shadow-primary/20 ring-2 ring-primary/60'
                      : 'bg-night-surface/90 hover:bg-night-surface border-white/10 hover:border-primary/40 shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-primary text-night-deep font-extrabold'
                        : 'bg-white/5 text-muted-foreground border border-white/10'
                    }`}>
                      {cat.count} {cat.count === 1 ? 'Variety' : 'Varieties'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    {isSelected && <span className="text-xs text-primary font-bold">✓</span>}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-1 font-body">
                    {cat.subtitle}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters & Search Section */}
      <section id="products-grid" className="relative py-6 sm:py-8 border-t border-b border-border/20" ref={ref}>
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="reveal space-y-5"
          >
            {/* Search + Controls Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Search Box */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search fireworks (e.g. Rocket, Sparkler, Sky Shot)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="boom-input w-full pl-10 pr-4 text-xs sm:text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="boom-select w-full text-xs sm:text-sm"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-3 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="boom-select w-full text-xs sm:text-sm appearance-none pr-9"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Sort: Top Rated ⭐</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Category Filter Pills (Horizontal scrollable on mobile) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-body text-primary font-semibold tracking-widest uppercase block flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Filter by Category:
                </label>
                <span className="text-[11px] text-muted-foreground sm:hidden">Swipe →</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {rawCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-body font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-primary text-night-deep font-bold shadow-md shadow-primary/30 ring-1 ring-primary'
                        : 'bg-night-surface text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30'
                    }`}
                  >
                    <span>{cat === 'All' ? '✨' : getCategoryMeta(cat).icon}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground/80 mt-6 pt-4 border-t border-white/5">
            <p>
              Showing <span className="text-foreground font-bold">{filtered.length}</span> of {products.length} products
              {selectedCategory !== 'All' && <span className="text-primary font-semibold"> in {selectedCategory}</span>}
              {searchTerm && <span> matching "{searchTerm}"</span>}
            </p>

            {(selectedCategory !== 'All' || selectedPriceRange !== 'All Prices' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPriceRange('All Prices');
                  setSearchTerm('');
                }}
                className="text-primary hover:underline font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
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
                    transition={{ delay: index * 0.04, duration: 0.4 }}
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
                className="text-center py-16 glass-card rounded-3xl border border-white/5 max-w-lg mx-auto p-8"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">No Fireworks Found</h3>
                <p className="text-muted-foreground font-body text-sm mb-6">
                  We couldn't find any products matching your current filters. Try selecting a different category or clearing search terms.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPriceRange('All Prices');
                    setSearchTerm('');
                  }}
                  className="btn-boom-primary px-6 py-2.5 text-sm font-bold"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <InquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
