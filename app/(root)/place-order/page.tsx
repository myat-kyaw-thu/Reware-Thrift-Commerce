import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { formatCurrency } from "@/lib/utils";
import type { ShippingAddress } from "@/types";
import { Clock, CreditCard, Edit3, MapPin, Package, Shield, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;
  const itemCount = cart.items.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <CheckoutSteps current={3} />

        {/* Header */}
        <div className="mt-8 mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Review Your Order</h1>
          <p className="text-muted-foreground mt-2">
            Please review your order details before completing your purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <Link href="/shipping-address">
                    <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="space-y-1">
                    <p className="font-medium text-card-foreground">{userAddress.fullName}</p>
                    <p className="text-muted-foreground">{userAddress.streetAddress}</p>
                    <p className="text-muted-foreground">
                      {userAddress.city}, {userAddress.postalCode}
                    </p>
                    <p className="text-muted-foreground">{userAddress.country}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Estimated delivery: 2-3 business days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <Link href="/payment-method">
                    <Button variant="outline" size="sm" className="gap-2 border-border bg-transparent">
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{user.paymentMethod}</p>
                      <p className="text-sm text-muted-foreground">Secure payment processing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Package className="h-5 w-5" />
                  Order Items ({itemCount} {itemCount === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={item.slug}>
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.slug}`} className="block">
                            <h3 className="font-medium text-card-foreground line-clamp-1">{item.name}</h3>
                          </Link>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">${item.price} each</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-card-foreground">
                            ${(Number.parseFloat(item.price) * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {index < cart.items.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary */}
              <Card className="border bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-card-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                      </span>
                      <span className="font-medium text-card-foreground">{formatCurrency(cart.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-card-foreground">
                        {Number.parseFloat(cart.shippingPrice) === 0 ? "Free" : formatCurrency(cart.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-card-foreground">{formatCurrency(cart.taxPrice)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-card-foreground">Total</span>
                      <span className="text-xl font-bold text-card-foreground">{formatCurrency(cart.totalPrice)}</span>
                    </div>

                    {/* Savings Badge */}
                    {Number.parseFloat(cart.shippingPrice) === 0 && (
                      <div className="bg-muted/50 border border-border rounded-lg p-3">
                        <p className="text-sm text-muted-foreground text-center">🎉 You saved on shipping!</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <PlaceOrderForm />
                  </div>
                </CardContent>
              </Card>

              {/* Order Protection */}
              <Card className="border bg-card">
                <CardContent className="p-4">
                  <h3 className="font-medium text-card-foreground mb-4">Order Protection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">SSL encrypted checkout</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Order Tracking</p>
                        <p className="text-xs text-muted-foreground">Real-time updates</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">30-Day Returns</p>
                        <p className="text-xs text-muted-foreground">Easy return policy</p>
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
};

export default PlaceOrderPage;
