import { useState } from 'react';
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

export default function Index() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#0e0e13' }}>
      <SparkCursor />
      <EmberParticles />
      <Navbar onContactClick={() => setIsInquiryOpen(true)} />
      <HeroSection onInquiryClick={() => setIsInquiryOpen(true)} />
      <FeatureBoxes onInquiryClick={() => setIsInquiryOpen(true)} />
      <AboutSection />
      <ProductsSection />
      <SafetySection />
      <CountdownSection />
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919922097669?text=Hello! I want to inquire about fireworks."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          boxShadow: '0 0 24px rgba(37, 211, 102, 0.4)',
        }}
        title="WhatsApp Us"
      >
        💬
      </a>

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </div>
  );
}
