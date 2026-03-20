import SparkCursor from '@/components/SparkCursor';
import EmberParticles from '@/components/EmberParticles';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import SafetySection from '@/components/SafetySection';
import CountdownSection from '@/components/CountdownSection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SparkCursor />
      <EmberParticles />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <SafetySection />
      <CountdownSection />
      <Footer />
    </div>
  );
}
