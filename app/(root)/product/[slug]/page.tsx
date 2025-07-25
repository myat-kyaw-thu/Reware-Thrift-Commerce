import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Shield, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import AddToCart from "../../../../components/shared/product/add-to-cart";
import Rating from "../../../../components/shared/product/animated-rating";
import ProductImages from "../../../../components/shared/product/product-images";
import { getMyCart } from "../../../../lib/actions/cart.actions";
import { getProductBySlug } from "../../../../lib/actions/product.action";
import ReviewList from './review-list';

const ProductDetailsPage = async (props: { params: Promise<{ slug: string; }>; }) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const cart = await getMyCart();


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <span>Home</span>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="lg:sticky lg:top-8">
            <ProductImages images={product.images} productName={product.name} />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Popular Badge */}
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>

            {/* Product Title */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">{product.name}</h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <Rating value={Number(product.rating)} size="md" />
                <span className="text-sm text-muted-foreground">
                  {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="py-2">
              <ProductPrice
                value={Number(product.price)}
                className="text-3xl lg:text-4xl font-bold text-foreground"
                size="lg"
              />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
            </div>



            {/* Shipping Info */}
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Free shipping and 30 days return</span>
            </div>



            <Separator className="my-8" />

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-muted/30 rounded-lg cursor-pointer">
                  <span className="font-medium text-foreground">Size & Fit</span>
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                    ›
                  </span>
                </summary>
                <div className="p-4 text-sm text-muted-foreground">
                  <p>True to size. We recommend ordering your usual size.</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-muted/30 rounded-lg cursor-pointer">
                  <span className="font-medium text-foreground">Shipping & Returns</span>
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                    ›
                  </span>
                </summary>
                <div className="p-4 text-sm text-muted-foreground">
                  <p>Free shipping on orders over $50. 30-day return policy.</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between p-4 bg-muted/30 rounded-lg cursor-pointer">
                  <span className="font-medium text-foreground">Designer Notes</span>
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                    ›
                  </span>
                </summary>
                <div className="p-4 text-sm text-muted-foreground">
                  <p>Crafted with premium materials and attention to detail.</p>
                </div>
              </details>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <div className="flex-1">
                {product.stock > 0 ? (
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: Number(product.price),
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                ) : (
                  <Button disabled className="w-full h-12 text-base">
                    Out of Stock
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-border bg-transparent"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">SSL encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Quality Guarantee</p>
                  <p className="text-xs text-muted-foreground">30-day returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">2-3 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <ReviewList userId={userId || ""} productId={product.id} productSlug={product.slug} />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
