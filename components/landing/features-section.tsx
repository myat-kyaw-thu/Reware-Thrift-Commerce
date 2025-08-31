"use client";

import {
  Clock,
  CreditCard,
  Shield,
  Truck
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $100" },
    { icon: Shield, title: "Secure Payment", desc: "Protected transactions" },
    { icon: Clock, title: "Fast Delivery", desc: "2-3 business days" },
    { icon: CreditCard, title: "Easy Returns", desc: "30-day return policy" }
  ];

  return (
    <section className="section-spacing bg-muted/20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-diagonal-lines pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};