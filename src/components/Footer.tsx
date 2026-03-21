import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Get Quote', href: '#' },
  { label: 'Safety Guide', href: '#safety' },
];

const productTypes = [
  'Rockets & Sky Shots',
  'Fountains',
  'Sparklers',
  'Sound Crackers',
  'Aerial Shells',
  'Gift Boxes',
  'Ground Chakkar',
  'Flower Pots',
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative"
      style={{ background: '#080910', borderTop: '1px solid rgba(72,71,77,0.2)' }}
    >
      {/* Colorful top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, #ef4444 0%, #f5b800 50%, #16a34a 100%)' }}
      />

      <div className="container mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="boom-logo-text text-3xl leading-none tracking-tight mb-2">
              <span className="boom-B">B</span>
              <span className="boom-O1">O</span>
              <span className="boom-O2">O</span>
              <span className="boom-M">M</span>
            </div>
            <p className="text-sm font-display font-semibold mb-1" style={{ color: 'rgba(249,245,253,0.6)' }}>
              Fireworks
            </p>
            <p className="text-xs font-body italic mb-5" style={{ color: 'rgba(172,170,177,0.6)' }}>
              "Here Comes The Boom 🎆"
            </p>

            <p className="text-sm font-body leading-relaxed mb-5"
               style={{ color: 'rgba(172,170,177,0.75)' }}>
              Fireworks Manufacturers, Wholesaler, Trader & Retailer.
              All kinds of fireworks available at the best prices.
            </p>

            {/* Contact Details */}
            <div className="space-y-2.5">
              <a href="tel:9922097669"
                 className="flex items-center gap-2.5 text-sm font-body group"
                 style={{ color: 'rgba(172,170,177,0.8)' }}>
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#16a34a' }} />
                <span className="group-hover:text-green-400 transition-colors">9922097669</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm font-body"
                   style={{ color: 'rgba(172,170,177,0.8)' }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                <span>In front of Rajmata School, Sale Galli, Gunigolai, Scrap Market Road, Gunigolai, Latur - 413 512</span>
              </div>
              <a href="https://instagram.com/boom_fireworks_official" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2.5 text-sm font-body group"
                 style={{ color: 'rgba(172,170,177,0.8)' }}>
                <Instagram className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f87171' }} />
                <span className="group-hover:text-red-400 transition-colors">@boom_fireworks_official</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase mb-5"
                style={{ color: '#f5b800' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-body transition-colors duration-300 hover:text-yellow-400"
                    style={{ color: 'rgba(172,170,177,0.7)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase mb-5"
                style={{ color: '#ef4444' }}>
              Our Products
            </h4>
            <ul className="space-y-2.5">
              {productTypes.map(p => (
                <li key={p}>
                  <a
                    href="/products"
                    className="text-sm font-body transition-colors duration-300 hover:text-red-400"
                    style={{ color: 'rgba(172,170,177,0.7)' }}
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase mb-5"
                style={{ color: '#16a34a' }}>
              Order Now
            </h4>
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(25,25,31,0.7)', border: '1px solid rgba(72,71,77,0.2)' }}
            >
              <p className="text-sm font-body mb-4" style={{ color: 'rgba(172,170,177,0.85)' }}>
                Call us or WhatsApp for instant quotes and bulk orders!
              </p>
              <a
                href="tel:9922097669"
                className="block w-full text-center btn-boom-primary mb-3 text-sm"
              >
                📞 Call: 9922097669
              </a>
              <a
                href="https://wa.me/919922097669?text=Hello! I want to inquire about fireworks."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center btn-boom-green text-sm"
              >
                💬 WhatsApp Us
              </a>
            </div>
            <p className="text-xs font-body text-center" style={{ color: 'rgba(172,170,177,0.5)' }}>
              📍 Visit us at Gunigolai, Latur
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(72,71,77,0.2)' }}
        >
          <p className="text-xs font-body" style={{ color: 'rgba(172,170,177,0.4)' }}>
            © 2026 Boom Fireworks, Latur. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms', 'Safety Guidelines'].map(item => (
              <a key={item} href="#"
                 className="text-xs font-body transition-colors duration-300 hover:text-yellow-400"
                 style={{ color: 'rgba(172,170,177,0.4)' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
