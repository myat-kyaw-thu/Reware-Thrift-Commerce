import ProductPrice from "@/components/shared/product/product-price"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import ProductImages from "../../../../components/shared/product/product-images"
// import { getMyCart } from "@/lib/actions/cart.actions"
// import { auth } from "@/auth"
import { Separator } from "@/components/ui/separator"
import { Package, Shield, Star, Truck, Users } from "lucide-react"
import Rating from "../../../../components/shared/product/animated-rating"
import { getProductBySlug } from "../../../../lib/actions/product.action"

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  // const session = await auth()
  // const userId = session?.user?.id

  // const cart = await getMyCart()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Product Images */}
          <div className="lg:col-span-6">
            <div className="sticky top-8">
              <ProductImages images={product.images} />
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <Rating value={Number(product.rating)} size="lg" showValue />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-medium">{product.numReviews}</span>
                <span>{product.numReviews === 1 ? "review" : "reviews"}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <ProductPrice value={Number(product.price)} className="text-3xl font-bold text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-700">
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

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Purchase Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <Card className="border shadow-sm">
                <CardContent className="p-6 space-y-6">
                  {/* Price Section */}
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price</div>
                    <ProductPrice value={Number(product.price)} className="text-3xl font-bold" />
                  </div>

                  {/* Stock Status */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Availability</div>
                    {product.stock > 0 ? (
                      <Badge
                        variant="outline"
                        className="w-full justify-center bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                        In Stock ({product.stock} available)
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="w-full justify-center bg-red-50 text-red-700 border-red-200"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  {/* Add to Cart Section - Uncomment when ready */}
                  {/* {product.stock > 0 && (
                    <div className="space-y-4">
                      <AddToCart
                        cart={cart}
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          qty: 1,
                          image: product.images![0],
                        }}
                      />

                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Secure checkout • Free returns • Fast shipping
                        </p>
                      </div>
                    </div>
                  )} */}

                  {/* Trust Indicators */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Why choose us?</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Star className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Trusted Quality</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Fast Delivery</span>
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
