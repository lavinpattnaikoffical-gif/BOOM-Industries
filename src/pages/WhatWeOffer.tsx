import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmberParticles from '@/components/EmberParticles';
import SparkCursor from '@/components/SparkCursor';
import ProductInquiryModal from '@/components/modals/ProductInquiryModal';
import EventInquiryModal from '@/components/modals/EventInquiryModal';

export default function WhatWeOffer() {
  const navigate = useNavigate();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SparkCursor />
      <EmberParticles />
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">
              What We <span className="glow-text-multi">Offer</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              From premium product supplies to spectacular event displays, we bring the magic of fireworks to your life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Section A: Product Custom Code */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Custom Product Orders</h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-8">
                  Order in bulk or customized quantities for your retail store or personal celebration. 
                  We supply directly from our manufacturing units to ensure quality and safety.
                </p>
                <ul className="space-y-3 mb-10 text-sm font-body text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Bulk wholesale pricing available
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Customized firework packages
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Direct factory dispatch
                  </li>
                </ul>
                <button 
                  onClick={() => setIsProductModalOpen(true)}
                  className="btn-boom-primary w-full py-4 flex items-center justify-center gap-2 group"
                >
                  Get Custom Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Section B: Event Custom Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-ember/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-ember/20 transition-all duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-ember/10 border border-ember/20 flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-ember" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Custom Event Fireworks</h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-8">
                  Planning a wedding, festival, or corporate event? Our expert team works with you 
                  to design a spectacular, safe, and mesmerizing firework show.
                </p>
                <ul className="space-y-3 mb-10 text-sm font-body text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ember" /> Grand Weddings & Receptions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ember" /> Festivals & Public Celebrations
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-ember" /> Corporate Events & Birthday Bashes
                  </li>
                </ul>
                <button 
                  onClick={() => setIsEventModalOpen(true)}
                  className="btn-boom-primary w-full py-4 flex items-center justify-center gap-2 group"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #f5b800)' }}
                >
                  Plan My Event <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      <ProductInquiryModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
      
      <EventInquiryModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}
