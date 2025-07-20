import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMyCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Shield, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import ProductCartTable from "./product-cart-table";

export default async function CartPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">Review your items before checkout</p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = cart.items.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Shopping Cart</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {cart.items.length} {cart.items.length === 1 ? "product" : "products"}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <ProductCartTable cart={cart} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary Card */}
              <Card className="border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-card-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                      </span>
                      <span className="font-medium text-card-foreground">${cart.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-card-foreground">
                        {Number.parseFloat(cart.shippingPrice) === 0 ? "Free" : `$${cart.shippingPrice}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-card-foreground">${cart.taxPrice}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-card-foreground">Total</span>
                    <span className="text-lg font-bold text-card-foreground">${cart.totalPrice}</span>
                  </div>

                  {/* Savings Badge */}
                  {Number.parseFloat(cart.shippingPrice) === 0 && (
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground text-center">🎉 You saved on shipping!</p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <form action="/shipping-address" method="get" className="w-full">
                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium transition-colors duration-200 text-base"
                    >
                      Proceed to Checkout
                    </button>
                  </form>

                  {/* Continue Shopping */}
                  <Link
                    href="/"
                    className="block w-full text-center py-3 text-muted-foreground text-sm border border-border rounded-lg bg-transparent transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="border bg-card">
                <CardContent className="p-4">
                  <h3 className="font-medium text-card-foreground mb-4">Why shop with us?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">On orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Secure Checkout</p>
                        <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Easy Returns</p>
                        <p className="text-xs text-muted-foreground">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
