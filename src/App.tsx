import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InquiryProvider } from "@/contexts/InquiryContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PageLoader from "./components/PageLoader.tsx";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton.tsx";

// Lazy load pages for better performance
const Products = lazy(() => import("./pages/Products.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const WhatWeOffer = lazy(() => import("./pages/WhatWeOffer.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InquiryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/products"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Products />
                </Suspense>
              }
            />
            <Route
              path="/gallery"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Gallery />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Admin />
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="/what-we-offer"
              element={
                <Suspense fallback={<PageLoader />}>
                  <WhatWeOffer />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppFloatingButton />
        </BrowserRouter>
      </TooltipProvider>
    </InquiryProvider>
  </QueryClientProvider>
);

export default App;
