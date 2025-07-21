"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  productName?: string;
}

const ProductImages = ({ images, productName = "Product" }: ProductImagesProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square relative overflow-hidden rounded-lg bg-muted border">
          <Image
            src={images[currentImage] || "/placeholder.svg?height=600&width=600"}
            alt={`${productName} - Image ${currentImage + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />

          {/* Expand Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 backdrop-blur-sm hover:bg-card"
            onClick={() => setIsZoomed(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 backdrop-blur-sm hover:bg-card"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/90 backdrop-blur-sm hover:bg-card"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-graphite-900/80 text-graphite-50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentImage + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden transition-all duration-200 border-2",
                currentImage === index ? "border-primary" : "border-border hover:border-muted-foreground",
              )}
            >
              <Image
                src={image || "/placeholder.svg?height=150&width=150"}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-2 bg-card">
          <div className="relative aspect-square">
            <Image
              src={images[currentImage] || "/placeholder.svg?height=800&width=800"}
              alt={`${productName} - Zoomed view`}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImages;
