import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, ShoppingBag, Sparkles, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInquiryCart } from '@/contexts/InquiryContext';

interface NavbarProps {
  onContactClick?: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useInquiryCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home',          href: '/' },
    { label: 'Products',      href: '/products' },
    { label: 'What We Offer', href: '/what-we-offer' },
    { label: 'Events',        href: '/gallery' },
    { label: 'Contact',       href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        background: scrolled || mobileMenuOpen ? 'rgba(14,14,19,0.95)' : 'transparent',
        backdropFilter: scrolled || mobileMenuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(72,71,77,0.25)' : 'none',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
        {/* ── Logo ── */}
        <a href="/" className="flex items-center gap-2 group py-1">
          <div className="boom-logo-text text-xl sm:text-2xl leading-none tracking-tight">
            <span className="boom-B">B</span>
            <span className="boom-O1">O</span>
            <span className="boom-O2">O</span>
            <span className="boom-M">M</span>
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-[9px] sm:text-[10px] font-body font-semibold tracking-[0.15em] uppercase text-muted-foreground/80"
            >
              Industries
            </span>
          </div>
        </a>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-display font-medium tracking-wide transition-colors duration-200 py-1 ${
                location.pathname === link.href ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          {itemCount > 0 && (
            <button
              onClick={onContactClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(245,184,0,0.1)',
                border: '1px solid rgba(245,184,0,0.3)',
                color: '#f5b800',
              }}
              title="View Inquiry List"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-black text-[10px] font-bold flex items-center justify-center shadow-lg">
                {itemCount}
              </span>
            </button>
          )}

          {/* Instagram Link */}
          <a
            href="https://instagram.com/boom_fireworks_official"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl text-sm font-display font-medium transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}
            title="Follow us on Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          
          {/* Phone */}
          <a
            href="tel:9920976669"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all duration-300"
            style={{
              background: 'rgba(22,163,74,0.1)',
              border: '1px solid rgba(22,163,74,0.3)',
              color: '#4ade80',
            }}
          >
            <Phone className="w-3.5 h-3.5" /> 9920976669
          </a>

          {/* Get Quote CTA */}
          <button onClick={onContactClick} className="btn-boom-primary text-xs font-bold px-4 py-2.5 rounded-xl">
            Get Quote
          </button>
        </div>

        {/* ── Mobile Actions ── */}
        <div className="flex md:hidden items-center gap-2.5">
          {itemCount > 0 && (
            <button
              onClick={onContactClick}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl text-sm transition-all"
              style={{
                background: 'rgba(245,184,0,0.12)',
                border: '1px solid rgba(245,184,0,0.35)',
                color: '#f5b800',
              }}
              aria-label="Inquiry Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-black text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            </button>
          )}

          <a
            href="tel:9920976669"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-green-400 bg-green-500/10 border border-green-500/30"
            aria-label="Call Now"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-primary"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden px-5 pb-6 pt-2 space-y-2 border-t border-white/10 bg-night-deep/98 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-display font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                      : 'text-foreground/90 hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {location.pathname === link.href && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </a>
              ))}

              <a
                href="/edit_page"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/edit_page');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-display text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-primary" /> Product Manager
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10">Admin</span>
              </a>
            </div>

            <div className="pt-3 space-y-2.5 border-t border-white/10">
              <button
                onClick={() => { onContactClick?.(); setMobileMenuOpen(false); }}
                className="w-full btn-boom-primary py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Sparkles className="w-4 h-4" /> Get Free Quote
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:9920976669"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold bg-green-500/10 border border-green-500/30 text-green-400"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Us
                </a>

                <a
                  href="https://instagram.com/boom_fireworks_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-display font-semibold bg-red-500/10 border border-red-500/30 text-red-400"
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
