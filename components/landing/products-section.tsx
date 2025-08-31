"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Product } from "@/types";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductsSectionProps {
  products: Product[];
  searchQuery: string;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  cartItems: { [key: string]: number; };
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}

export const ProductsSection = ({
  products,
  searchQuery,
  priceRange,
  setPriceRange,
  cartItems,
  addToCart,
  removeFromCart
}: ProductsSectionProps) => {
  // Use real products from API, limit to 6 for featured section
  const featuredProducts = products.slice(0, 6);

  return (
    <section id="products" className="section-spacing relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots-pattern pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-light text-foreground mb-6">
            Featured <span className="font-semibold">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked items that represent the perfect balance of quality, design, and value
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={0}
              step={10}
              className="w-64"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts
            .filter(product =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1]
            )
            .map((product, index) => (
              <Card
                key={product.id}
                className="animate-slide-up bg-card border-border/50 group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-muted/30 relative overflow-hidden">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=400&width=400"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  {product.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-display transition-colors">
                        <Link href={`/product/${product.slug}`} className="hover:text-primary">
                          {product.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {product.category}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(Number(product.rating))
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                            }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.numReviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-semibold text-foreground">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {cartItems[product.id] ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium px-3">
                          {cartItems[product.id]}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        In Cart
                      </span>
                    </div>
                  ) : (
                    <Button
                      className="w-full font-medium"
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      {product.stock > 0 && <ShoppingBag className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};
