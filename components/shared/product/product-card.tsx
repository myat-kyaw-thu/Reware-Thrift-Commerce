"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Rating from './animated-rating';
import ProductPrice from "./product-price";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onToggleFavorite }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
  };

  return (
    <Card className="group flex flex-col h-full overflow-hidden border bg-card transition-colors duration-200">
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.images[0] || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={false}
            />
          </Link>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm transition-colors duration-200 hover:bg-card border border-border"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isFavorite
                  ? "text-graphite-800 fill-graphite-800 dark:text-graphite-200 dark:fill-graphite-200"
                  : "text-muted-foreground",
              )}
            />
          </button>

          {/* Stock Status */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-graphite-900/60 dark:bg-graphite-900/80">
              <span className="px-3 py-1 text-sm font-medium text-graphite-50 bg-graphite-800 dark:bg-graphite-700 rounded-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="flex flex-col flex-1 p-4">
          <Link href={`/product/${product.slug}`} className="flex-1">
            <h3 className="font-medium text-card-foreground leading-tight hover:text-muted-foreground transition-colors duration-200 h-12 flex items-start">
              <span className="line-clamp-2">{product.name}</span>
            </h3>
          </Link>

          <div className="mt-auto space-y-3">
            <ProductPrice value={Number(product.price)} size="md" />

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10 flex items-start">
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam auctor, augue eget cursus mattis.
              </span>
            </p>

            <Rating value={Number(product.rating)} reviewCount={Math.floor(Math.random() * 1000) + 100} size="sm" />

            {product.stock > 0 && (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              >
                Add to cart
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;
