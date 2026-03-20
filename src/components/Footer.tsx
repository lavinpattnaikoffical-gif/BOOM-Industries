import { MapPin, Phone, Mail } from 'lucide-react';

const links = {
  Products: ['Rockets', 'Fountains', 'Sparklers', 'Crackers', 'Sky Shots', 'Gift Boxes'],
  Company: ['About Us', 'Our Story', 'Manufacturing', 'Careers', 'Press'],
  Support: ['Dealer Enquiry', 'Safety Guide', 'Shipping', 'Returns', 'FAQ'],
};

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border/30 bg-night-deep">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-2xl mb-4">
              <span className="glow-text-gold">SONNY</span>
              <span className="text-foreground/70 ml-1 font-light">Fireworks</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-sm mb-6">
              Crafting joy since 1982. India's trusted name in premium fireworks,
              bringing light and celebration to every corner of the nation.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground font-body">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary/70" />
                Sivakasi, Tamil Nadu, India
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary/70" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary/70" />
                hello@sonnyfireworks.in
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-foreground/80 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground font-body hover:text-primary transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60 font-body">
            © 2026 Sonny Fireworks Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Instagram', 'YouTube', 'Facebook'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-300 font-body"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
