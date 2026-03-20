import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import productSparklers from '@/assets/product-sparklers.jpg';
import productRockets from '@/assets/product-rockets.jpg';
import productFountains from '@/assets/product-fountains.jpg';
import productCrackers from '@/assets/product-crackers.jpg';

const categories = ['All', 'Rockets', 'Fountains', 'Sparklers', 'Crackers'];

const products = [
  { name: 'Golden Blaze Rockets', category: 'Rockets', image: productRockets, price: '₹450', rating: '4.8' },
  { name: 'Royal Fountain Cone', category: 'Fountains', image: productFountains, price: '₹320', rating: '4.9' },
  { name: 'Premium Sparkler Box', category: 'Sparklers', image: productSparklers, price: '₹180', rating: '4.7' },
  { name: 'Festival Cracker Pack', category: 'Crackers', image: productCrackers, price: '₹550', rating: '4.6' },
  { name: 'Sky Commander Multi-Shot', category: 'Rockets', image: productRockets, price: '₹1,200', rating: '4.9' },
  { name: 'Diamond Rain Fountain', category: 'Fountains', image: productFountains, price: '₹480', rating: '4.8' },
];

export default function ProductsSection() {
  const ref = useScrollReveal();
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active);

  return (
    <section id="products" className="relative py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-body text-primary tracking-widest uppercase">Collection</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-4">
            Premium <span className="glow-text-gold">Fireworks</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Over 700 meticulously crafted products, from dazzling sky shots to elegant fountains.
          </p>
        </div>

        {/* Category Filter */}
        <div className="reveal flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-body font-medium transition-all duration-300 active:scale-[0.96] ${
                active === cat
                  ? 'bg-primary text-primary-foreground glow-sm'
                  : 'bg-night-surface text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {filtered.map((product, i) => (
            <div
              key={product.name + i}
              className="reveal group glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-deep via-transparent to-transparent opacity-80" />

                {/* Hover glow overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-night-deep/70 border border-primary/20 text-xs font-body text-primary">
                  ★ {product.rating}
                </div>
              </div>

              <div className="p-5">
                <span className="text-[11px] text-muted-foreground font-body tracking-wider uppercase">{product.category}</span>
                <h3 className="font-display font-semibold text-lg mt-1 mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xl text-primary">{product.price}</span>
                  <span className="text-xs text-muted-foreground/60 font-body">per pack</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
