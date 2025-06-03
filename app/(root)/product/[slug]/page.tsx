import ProductPrice from "@/components/shared/product/product-price"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Package, Share2, Shield, Star, Truck, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { auth } from "../../../../auth"
import AddToCart from "../../../../components/shared/product/add-to-cart"
import Rating from "../../../../components/shared/product/animated-rating"
import ProductImages from "../../../../components/shared/product/product-images"
import { getMyCart } from "../../../../lib/actions/cart.actions"
import { getProductBySlug } from "../../../../lib/actions/product.action"


const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const session = await auth()
  const userId = session?.user?.id

  const cart = await getMyCart()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
          {/* Product Images - Takes up more space */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ProductImages images={product.images} />
            </div>
          </div>

          {/* Product Information - More breathing room */}
          <div className="xl:col-span-1 space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-tight">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Rating value={Number(product.rating)} size="lg" showValue />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-medium">{product.numReviews}</span>
                <span>{product.numReviews === 1 ? "review" : "reviews"}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <ProductPrice value={Number(product.price)} className="text-2xl lg:text-3xl font-bold text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit">
                Best Price
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Product Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Features - Stack on smaller screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Quality Guarantee</p>
                  <p className="text-sm text-blue-700">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                <Truck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">Free Shipping</p>
                  <p className="text-sm text-green-700">On orders over $50</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Card - Much wider now */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Main Product Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-6 lg:p-8">
                  {/* Price Section */}
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Price</p>
                    <ProductPrice
                      value={Number(product.price)}
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    />
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Availability</p>
                    {product.stock > 0 ? (
                      <div className="flex items-center justify-center p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
                        <span className="text-emerald-700 font-medium">In Stock ({product.stock} available)</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-4 rounded-xl bg-red-50 border border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                        <span className="text-red-700 font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Section */}
                  {product.stock > 0 && (
                    <div className="mb-6">
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
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <Button variant="outline" size="lg" className="h-12">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="outline" size="lg" className="h-12">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Security Notice */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      🔒 Secure checkout • 30-day returns • Free shipping over $50
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-center">Why Choose Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">Trusted Quality</p>
                        <p className="text-xs text-muted-foreground">4.8/5 customer rating</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium">Fast Delivery</p>
                        <p className="text-xs text-muted-foreground">2-3 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* <ReviewList userId={userId || ""} productId={product.id} productSlug={product.slug} /> */}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailsPage
