import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import productSparklers from '@/assets/product-sparklers.jpg';
import productRockets from '@/assets/product-rockets.jpg';
import productFountains from '@/assets/product-fountains.jpg';
import productCrackers from '@/assets/product-crackers.jpg';

const categories = ['All', 'Rockets', 'Fountains', 'Sparklers', 'Crackers'];

const products = [
  { name: 'Sky Commander Multi-Shot', category: 'Rockets',  image: productRockets,   price: '₹1,200', rating: '4.9', glow: '#ef4444', tag: 'Top Pick' },
  { name: 'Golden Blaze Rockets',     category: 'Rockets',  image: productRockets,   price: '₹450',   rating: '4.8', glow: '#f5b800', tag: 'Best Seller' },
  { name: 'Diamond Rain Fountain',    category: 'Fountains',image: productFountains, price: '₹480',   rating: '4.8', glow: '#16a34a', tag: 'New' },
  { name: 'Royal Fountain Cone',      category: 'Fountains',image: productFountains, price: '₹320',   rating: '4.9', glow: '#7eafff', tag: 'Top Rated' },
  { name: 'Premium Sparkler Box',     category: 'Sparklers',image: productSparklers, price: '₹180',   rating: '4.7', glow: '#f5b800', tag: 'Gift Ready' },
  { name: 'Festival Cracker Pack',    category: 'Crackers', image: productCrackers,  price: '₹550',   rating: '4.6', glow: '#ef4444', tag: 'Popular' },
];

export default function ProductsSection() {
  const ref = useScrollReveal();
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? products : products.filter(p => p.category === active);

  return (
    <section id="products" className="relative py-24" ref={ref}
             style={{ background: '#0e0e13' }}>
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,184,0,0.03) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-5 relative">
        {/* Header */}
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

        {/* Category Filter */}
        <div className="reveal flex flex-wrap justify-center gap-2.5 mb-10">
          {categories.map(cat => (
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

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {filtered.map((p, i) => (
            <div
              key={p.name + i}
              className="reveal boom-card rounded-2xl overflow-hidden cursor-pointer"
              style={{
                border: `1px solid ${p.glow}18`,
                transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${p.glow}50`;
                el.style.boxShadow = `0 0 32px ${p.glow}22, 0 12px 40px rgba(0,0,0,0.4)`;
                el.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${p.glow}18`;
                el.style.boxShadow = '';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img src={p.image} alt={p.name}
                     className="w-full h-52 object-cover transition-transform duration-500"
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(to top, rgba(14,14,19,0.9) 0%, transparent 55%)' }} />
                {/* Rating */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-display font-bold"
                     style={{ background: 'rgba(14,14,19,0.8)', backdropFilter: 'blur(8px)', border: `1px solid ${p.glow}40`, color: p.glow }}>
                  ★ {p.rating}
                </div>
                {/* Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-display font-bold tracking-wider uppercase"
                     style={{ background: `${p.glow}20`, border: `1px solid ${p.glow}40`, color: p.glow }}>
                  {p.tag}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <span className="text-[11px] font-body tracking-wider uppercase"
                      style={{ color: 'rgba(172,170,177,0.6)' }}>{p.category}</span>
                <h3 className="font-display font-bold text-base mt-1 mb-3" style={{ color: '#f9f5fd' }}>
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xl" style={{ color: p.glow }}>{p.price}</span>
                  <button className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-300"
                          style={{ background: `${p.glow}15`, border: `1px solid ${p.glow}35`, color: p.glow }}>
                    Add to Inquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10 reveal">
          <a href="/products" className="btn-boom-primary">
            View Full Catalog — 700+ Products
          </a>
        </div>
      </div>
    </section>
  );
}
