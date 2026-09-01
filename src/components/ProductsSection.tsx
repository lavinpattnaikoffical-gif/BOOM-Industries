import { useProducts } from '@/contexts/ProductContext';
import { useInquiryCart } from '@/contexts/InquiryContext';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { formatGoogleDriveUrl } from '@/utils/imageHelper';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductsSection() {
  const ref = useScrollReveal();
  const { addItem } = useInquiryCart();
  const { toast } = useToast();
  const { products } = useProducts();

  // Show only 3-4 top featured highlights on the main page
  const featuredProducts = products.slice(0, 3);

  const getGlowColor = (category: string) => {
    switch(category) {
      case 'Rockets': return '#ef4444';
      case 'Fountains': return '#16a34a';
      case 'Sparklers': return '#f5b800';
      case 'Crackers': return '#ef4444';
      case 'Aerial Shells': return '#a855f7';
      default: return '#7eafff';
    }
  };

  const handleAddInquiry = (p: any) => {
    addItem({
      productId: p.id,
      productName: p.name,
      category: p.category,
      price: p.price,
      quantity: 1
    });
    toast({
      title: 'Added to Inquiry!',
      description: `${p.name} added to your inquiry list. Check the navbar to submit.`,
      duration: 3000
    });
  };

  return (
    <section id="products" className="relative py-24" ref={ref} style={{ background: '#0e0e13' }}>
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,184,0,0.03) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-5 relative max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Best Sellers Preview
          </div>
          <h2 className="font-display font-bold mt-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#f9f5fd' }}>
            Featured <span className="glow-text-multi">Fireworks</span>
          </h2>
          <p className="font-body mt-2 text-sm md:text-base max-w-xl mx-auto" style={{ color: 'rgba(172,170,177,0.85)' }}>
            Handpicked customer favorites for weddings, festivals & grand celebrations.
          </p>
        </div>

        {/* Featured Highlights Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children mb-12">
            {featuredProducts.map((p, i) => (
              <div
                key={p.id || i}
                className="reveal boom-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
                style={{
                  border: `1px solid ${getGlowColor(p.category)}20`,
                  transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  const color = getGlowColor(p.category);
                  el.style.borderColor = `${color}60`;
                  el.style.boxShadow = `0 0 32px ${color}25, 0 12px 40px rgba(0,0,0,0.4)`;
                  el.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  const color = getGlowColor(p.category);
                  el.style.borderColor = `${color}20`;
                  el.style.boxShadow = '';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div className="relative overflow-hidden h-56 bg-night-surface">
                  <img 
                    src={formatGoogleDriveUrl(p.image)} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute inset-0"
                       style={{ background: 'linear-gradient(to top, rgba(14,14,19,0.9) 0%, transparent 50%)' }} />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold uppercase tracking-wider"
                       style={{ background: 'rgba(14,14,19,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${getGlowColor(p.category)}40`, color: getGlowColor(p.category) }}>
                    {p.category}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-display font-bold flex items-center gap-1"
                       style={{ background: 'rgba(14,14,19,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,184,0,0.4)', color: '#f5b800' }}>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {p.rating || '4.8'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1.5 text-foreground">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {p.description || 'Premium quality handcrafted fireworks for dazzling moments.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="font-display font-extrabold text-2xl text-primary">{p.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddInquiry(p); }}
                      className="px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: `${getGlowColor(p.category)}18`, 
                        border: `1px solid ${getGlowColor(p.category)}40`, 
                        color: getGlowColor(p.category) 
                      }}>
                      + Add to Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center border border-white/5 mb-12">
            <p className="text-muted-foreground text-sm">
              Featured fireworks will appear here once added in the Product Manager.
            </p>
          </div>
        )}

        {/* CTA to Full Store */}
        <div className="text-center reveal">
          <Link 
            to="/products" 
            className="btn-boom-primary inline-flex items-center gap-2.5 px-8 py-4 text-sm md:text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <span>Explore Complete 700+ Fireworks Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
