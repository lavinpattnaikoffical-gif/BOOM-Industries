import { useState, useEffect } from 'react';
import { fetchProducts } from '@/api/admin';
import { Product } from '@/types';
import { useInquiryCart } from '@/contexts/InquiryContext';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ProductsSection() {
  const ref = useScrollReveal();
  const { addItem } = useInquiryCart();
  const { toast } = useToast();
  const [active, setActive] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getGlowColor = (category: string) => {
    switch(category) {
      case 'Rockets': return '#ef4444';
      case 'Fountains': return '#16a34a';
      case 'Sparklers': return '#f5b800';
      case 'Crackers': return '#ef4444';
      default: return '#7eafff';
    }
  };

  const handleAddInquiry = (p: Product) => {
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

  const filtered = active === 'All' ? products : products.filter(p => p.category === active);

  // Fallback products if DB is empty
  const displayProducts = filtered.length > 0 ? filtered : [
    { id: 'f1', name: 'Premium Sky Rocket', category: 'Rockets', price: '₹450', image: 'https://images.unsplash.com/photo-1533230408703-a2321476c827?auto=format&fit=crop&q=80', rating: '4.8' },
    { id: 'f2', name: 'Golden Sparklers', category: 'Sparklers', price: '₹150', image: 'https://images.unsplash.com/photo-1467810563316-b54765359382?auto=format&fit=crop&q=80', rating: '4.5' },
    { id: 'f3', name: 'Silver Fountain', category: 'Fountains', price: '₹280', image: 'https://images.unsplash.com/photo-1533230119143-d10ee7b00951?auto=format&fit=crop&q=80', rating: '4.7' }
  ];

  return (
    <section id="products" className="relative py-24" ref={ref}
             style={{ background: '#0e0e13' }}>
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,184,0,0.03) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-5 relative">
        <div className="text-center mb-14 reveal">
          <span className="boom-pill">All Products</span>
          <h2 className="font-display font-bold mt-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#f9f5fd' }}>
            Our Fireworks Collection
          </h2>
          <p className="font-body mt-2" style={{ color: 'rgba(172,170,177,0.85)' }}>
            700+ varieties — rockets, sparklers, fountains, aerial shells, crackers & more
          </p>
        </div>

        <div className="reveal flex flex-wrap justify-center gap-2.5 mb-10">
          {['All', ...new Set(products.map(p => p.category))].map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-5 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300 active:scale-95"
              style={{
                background: active === cat ? '#f5b800' : 'rgba(37,37,45,0.7)',
                color: active === cat ? '#0e0e13' : 'rgba(172,170,177,0.85)',
                border: active === cat ? 'none' : '1px solid rgba(72,71,77,0.4)',
                boxShadow: active === cat ? '0 0 20px rgba(245,184,0,0.4)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {displayProducts.map((p, i) => (
            <div
              key={p.id || i}
              className="reveal boom-card rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: `1px solid ${getGlowColor(p.category)}18`,
                transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                const color = getGlowColor(p.category);
                el.style.borderColor = `${color}50`;
                el.style.boxShadow = `0 0 32px ${color}22, 0 12px 40px rgba(0,0,0,0.4)`;
                el.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                const color = getGlowColor(p.category);
                el.style.borderColor = `${color}18`;
                el.style.boxShadow = '';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div className="relative overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-52 object-cover transition-transform duration-500" />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, rgba(14,14,19,0.9) 0%, transparent 55%)' }} />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-display font-bold"
                     style={{ background: 'rgba(14,14,19,0.8)', backdropFilter: 'blur(8px)', border: `1px solid ${getGlowColor(p.category)}40`, color: getGlowColor(p.category) }}>
                  ★ {p.rating || '4.5'}
                </div>
              </div>

              <div className="p-5">
                <span className="text-[11px] font-body tracking-wider uppercase"
                      style={{ color: 'rgba(172,170,177,0.6)' }}>{p.category}</span>
                <h3 className="font-display font-bold text-base mt-1 mb-3" style={{ color: '#f9f5fd' }}>
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xl" style={{ color: getGlowColor(p.category) }}>{p.price}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddInquiry(p as any); }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-300"
                    style={{ background: `${getGlowColor(p.category)}15`, border: `1px solid ${getGlowColor(p.category)}35`, color: getGlowColor(p.category) }}>
                    Add to Inquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 reveal">
          <a href="/products" className="btn-boom-primary">
            View Full Catalog — 700+ Products
          </a>
        </div>
      </div>
    </section>
  );
}
