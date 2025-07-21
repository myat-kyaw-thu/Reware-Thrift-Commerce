"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useState } from "react";
import ProductCard from "./product-card";

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

const ProductList = ({ data, title, limit, onAddToCart, onToggleFavorite }: ProductListProps) => {
  const [visibleItems, setVisibleItems] = useState(limit || 8);
  const limitedData = data.slice(0, visibleItems);
  const hasMore = data.length > visibleItems;

  const loadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  return (
    <section className="py-8">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
      )}

      {data.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {limitedData.map((product: Product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="px-8 py-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 bg-transparent"
              >
                Load more products
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </section>
  );
};

export default ProductList;
