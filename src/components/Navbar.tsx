import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['About', 'Products', 'Safety', 'Contact'];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-night-deep/80 backdrop-blur-xl border-b border-border/30'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-xl tracking-tight">
          <span className="glow-text-gold">SONNY</span>
          <span className="text-foreground/80 ml-1 font-light">Fireworks</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body tracking-wide uppercase"
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#products"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 glow-sm"
        >
          Explore Collection
        </a>
      </div>
    </nav>
  );
}
