import FireworksCanvas from './FireworksCanvas';
import heroImg from '@/assets/hero-fireworks.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-deep/60 via-night-deep/40 to-night-deep" />
      </div>

      {/* Fireworks canvas */}
      <FireworksCanvas />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-body text-primary/80 tracking-widest uppercase">
            Est. 1982 — Four Decades of Brilliance
          </span>
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6">
          <span className="block text-foreground">Igniting</span>
          <span className="block glow-text-multi mt-2">Celebrations</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          700+ fireworks crafted with passion. 4,000+ dealers across India.
          <br className="hidden sm:block" />
          One legacy of trust lighting up every festival.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#products"
            className="group relative px-8 py-3.5 rounded-lg font-display font-semibold text-primary-foreground overflow-hidden transition-transform duration-200 active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-ember to-primary bg-[length:200%_100%] animate-shimmer" />
            <span className="relative z-10">Explore Products</span>
          </a>

          <a
            href="#about"
            className="px-8 py-3.5 rounded-lg font-display font-medium text-foreground border border-foreground/20 hover:border-primary/40 hover:text-primary transition-all duration-300 active:scale-[0.97]"
          >
            Our Story
          </a>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
