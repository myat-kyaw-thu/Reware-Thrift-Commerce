"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecommendedProductsProps {
  products: Product[];
}

export const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  return (
    <Card className="dashboard-card animate-slide-in-left shadow-md border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="aspect-square bg-muted/30 relative overflow-hidden">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images[0] || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                {product.isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(Number(product.rating))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                          }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.numReviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <Button size="sm" className="text-xs">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};