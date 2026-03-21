import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useInquiryCart } from '@/contexts/InquiryContext';

interface NavbarProps {
  onContactClick?: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useInquiryCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products', onClick: () => navigate('/products') },
    { label: 'Gallery',  href: '/gallery',  onClick: () => navigate('/gallery') },
    { label: 'Contact',  href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400`}
      style={{
        background: scrolled ? 'rgba(14,14,19,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(72,71,77,0.25)' : 'none',
      }}
    >
      <div className="container mx-auto px-5 py-3.5 flex items-center justify-between">
        {/* ── Logo ── */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="boom-logo-text text-2xl leading-none tracking-tight">
            <span className="boom-B">B</span>
            <span className="boom-O1">O</span>
            <span className="boom-O2">O</span>
            <span className="boom-M">M</span>
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[10px] font-body font-semibold tracking-[0.15em] uppercase"
              style={{ color: 'rgba(249,245,253,0.6)' }}
            >
              Fireworks
            </span>
          </div>
        </a>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) { e.preventDefault(); link.onClick(); }
              }}
              className="text-sm font-display font-medium tracking-wide transition-colors duration-300"
              style={{ color: 'rgba(172,170,177,1)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f5b800')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(172,170,177,1)')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart badge */}
          {itemCount > 0 && (
            <button
              onClick={onContactClick}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-300"
              style={{
                background: 'rgba(245,184,0,0.1)',
                border: '1px solid rgba(245,184,0,0.3)',
                color: '#f5b800',
              }}
            >
              🛒 Inquiry ({itemCount})
            </button>
          )}
          {/* Phone */}
          <a
            href="tel:9922097669"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium transition-all duration-300"
            style={{
              background: 'rgba(22,163,74,0.1)',
              border: '1px solid rgba(22,163,74,0.3)',
              color: '#4ade80',
            }}
          >
            <Phone className="w-3.5 h-3.5" /> 9922097669
          </a>
          {/* Get Quote CTA */}
          <button onClick={onContactClick} className="btn-boom-primary text-sm">
            Get Quote
          </button>
        </div>

        {/* ── Mobile Menu Button ── */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          style={{ color: '#f5b800' }}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-5 py-4 space-y-3"
          style={{
            background: 'rgba(14,14,19,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(72,71,77,0.25)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.onClick) { e.preventDefault(); link.onClick(); }
                setMobileMenuOpen(false);
              }}
              className="block text-base font-display font-medium py-2 transition-colors duration-300"
              style={{ color: 'rgba(172,170,177,0.9)' }}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(72,71,77,0.25)' }}>
            <a
              href="tel:9922097669"
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg font-display font-semibold text-sm"
              style={{
                background: 'rgba(22,163,74,0.12)',
                border: '1px solid rgba(22,163,74,0.3)',
                color: '#4ade80',
              }}
            >
              <Phone className="w-4 h-4" /> Call: 9922097669
            </a>
            <button
              onClick={() => { onContactClick?.(); setMobileMenuOpen(false); }}
              className="w-full btn-boom-primary"
            >
              Get Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
