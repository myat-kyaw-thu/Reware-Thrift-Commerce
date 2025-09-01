"use client";

import { BrandSlider, ContactSection, FeaturesSection, Footer, Hero, Navbar, ProductsSection } from '@/components/landing';
import { Product } from "@/types";
import { useState } from "react";

interface LandingPageProps {
  products: Product[];
}

const LandingPage = ({ products }: LandingPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<{ [key: string]: number; }>({});
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pt-24">
        <Hero />

        <BrandSlider />

        <ProductsSection
          products={products}
          searchQuery={searchQuery}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />

        <FeaturesSection />

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;