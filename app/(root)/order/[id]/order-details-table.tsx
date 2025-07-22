"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { approvePayPalOrder, createPayPalOrder, deliverOrder, updateOrderToPaidCOD } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import type { Order } from "@/types";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CheckCircle, Clock, CreditCard, MapPin, Package, Receipt, Shield, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  const { toast } = useToast();

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error Loading PayPal";
    }
    return status ? <div className="text-sm text-muted-foreground">{status}</div> : null;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string; }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type="button"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground"
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "Mark As Paid"
        )}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type="button"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground"
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "Mark As Delivered"
        )}
      </Button>
    );
  };

  const itemCount = orderitems.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Receipt className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Order {formatId(id)}</h1>
              <p className="text-muted-foreground">Order details and payment information</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{paymentMethod}</p>
                        <p className="text-sm text-muted-foreground">
                          {isPaid ? `Paid on ${formatDateTime(paidAt!).dateTime}` : "Payment pending"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isPaid ? (
                        <Badge className="bg-muted text-muted-foreground border-border">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-destructive text-destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Paid
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-card-foreground">{shippingAddress.fullName}</p>
                      <p className="text-muted-foreground">{shippingAddress.streetAddress}</p>
                      <p className="text-muted-foreground">
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p className="text-muted-foreground">{shippingAddress.country}</p>
                      {isDelivered && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Delivered on {formatDateTime(deliveredAt!).dateTime}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      {isDelivered ? (
                        <Badge className="bg-muted text-muted-foreground border-border">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          In Transit
                        </Badge>
                      )}
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
                  {orderitems.map((item, index) => (
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
                      {index < orderitems.length - 1 && <Separator className="my-4" />}
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
                      <span className="font-medium text-card-foreground">{formatCurrency(itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-card-foreground">
                        {Number.parseFloat(shippingPrice) === 0 ? "Free" : formatCurrency(shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-card-foreground">{formatCurrency(taxPrice)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-card-foreground">Total</span>
                      <span className="text-xl font-bold text-card-foreground">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Payment Actions */}
                  <div className="mt-6 space-y-4">
                    {/* PayPal Payment */}
                    {!isPaid && paymentMethod === "PayPal" && (
                      <div className="space-y-3">
                        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                          <PrintLoadingState />
                          <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                        </PayPalScriptProvider>
                      </div>
                    )}

                    {/* Stripe Payment */}
                    {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                      <StripePayment
                        priceInCents={Number(order.totalPrice) * 100}
                        orderId={order.id}
                        clientSecret={stripeClientSecret}
                      />
                    )}

                    {/* Cash On Delivery */}
                    {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && <MarkAsPaidButton />}

                    {/* Mark as Delivered */}
                    {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card className="border bg-card">
                <CardContent className="p-4">
                  <h3 className="font-medium text-card-foreground mb-4">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isPaid ? "bg-muted" : "bg-muted/50"
                          }`}
                      >
                        {isPaid ? (
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Payment</p>
                        <p className="text-xs text-muted-foreground">{isPaid ? "Completed" : "Pending"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDelivered ? "bg-muted" : "bg-muted/50"
                          }`}
                      >
                        {isDelivered ? (
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Delivery</p>
                        <p className="text-xs text-muted-foreground">{isDelivered ? "Delivered" : "In transit"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Protection</p>
                        <p className="text-xs text-muted-foreground">30-day guarantee</p>
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

export default OrderDetailsTable;
