import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SparkCursor from '@/components/SparkCursor';
import EmberParticles from '@/components/EmberParticles';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureBoxes from '@/components/FeatureBoxes';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import SafetySection from '@/components/SafetySection';
import CountdownSection from '@/components/CountdownSection';
import Footer from '@/components/Footer';
import InquiryModal from '@/components/InquiryModal';
import ProductInquiryModal from '@/components/modals/ProductInquiryModal';
import EventInquiryModal from '@/components/modals/EventInquiryModal';

export default function Index() {
  const navigate = useNavigate();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isProductInquiryOpen, setIsProductInquiryOpen] = useState(false);
  const [isEventInquiryOpen, setIsEventInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#0e0e13' }}>
      <SparkCursor />
      <EmberParticles />
      <Navbar onContactClick={() => setIsInquiryOpen(true)} />
      <HeroSection onInquiryClick={() => setIsInquiryOpen(true)} />
      
      {/* ── Trust Bar ── */}
      <div className="bg-white/5 border-y border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-8 items-center text-xs md:text-sm font-display font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
          <span>Trusted by 1000+ customers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Manufacturers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Wholesaler</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Trader & Retailer</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Trusted by 1000+ customers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Manufacturers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Wholesaler</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Trader & Retailer</span>
        </div>
      </div>

      <FeatureBoxes 
        onInquiryClick={() => setIsInquiryOpen(true)}
        onProductsClick={() => navigate('/products')}
        onMediaClick={() => navigate('/gallery')}
      />
      <AboutSection />
      <ProductsSection />
      <SafetySection />
      <CountdownSection />
      <Footer />

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      <ProductInquiryModal
        isOpen={isProductInquiryOpen}
        onClose={() => setIsProductInquiryOpen(false)}
      />

      <EventInquiryModal
        isOpen={isEventInquiryOpen}
        onClose={() => setIsEventInquiryOpen(false)}
      />
    </div>
  );
}
