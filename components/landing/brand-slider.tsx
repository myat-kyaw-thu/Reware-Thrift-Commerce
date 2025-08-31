"use client";

import { InfiniteSlider } from '@/components/ui/infinite-slider';

export const BrandSlider = () => {
  const brands = [
    "Apple", "Samsung", "Sony", "Nike", "Adidas", "Microsoft",
    "Google", "Amazon", "Tesla", "BMW", "Mercedes", "Audi"
  ];

  return (
    <section className="py-16 bg-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern pointer-events-none"></div>
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-light text-foreground mb-4">
            Trusted by <span className="font-semibold">Leading Brands</span>
          </h2>
        </div>

        <InfiniteSlider
          speed={25}
          direction="left"
          className="py-4"
          gap="4rem"
        >
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-2xl md:text-3xl font-display font-light text-muted-foreground whitespace-nowrap brand-item cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
};