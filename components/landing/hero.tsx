"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>
      <div className="absolute inset-0 bg-noise-pattern pointer-events-none"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full floating-element pointer-events-none"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-primary/30 rounded-full floating-element pointer-events-none"></div>
      <div className="absolute bottom-40 left-20 w-1 h-1 bg-primary/25 rounded-full floating-element pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary/20 rounded-full floating-element pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-light mb-8 animate-fade-in">
            <span className="gradient-text">Premium Quality,</span>
            <br />
            <span className="font-semibold text-primary">Modern Design</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
            Discover carefully curated products that blend functionality with exceptional design. Quality you can trust, style you&apos;ll love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button size="lg" className="px-8 py-4 text-lg font-medium" asChild>
              <Link href="#products">
                Shop Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium" asChild>
              <Link href="#products">
                View Catalog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};