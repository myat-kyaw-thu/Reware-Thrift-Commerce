"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { downloadInvoice } from '@/lib/invoice';
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import type { Order } from "@/types";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  Receipt,
  Shield,
  Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserOrderDetails = ({
  order,
  user,
}: {
  order: Omit<Order, "paymentResult">;
  user?: {
    name?: string | null;
    email?: string | null;
  };
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
    createdAt,
  } = order;

  const itemCount = orderitems.reduce((total, item) => total + item.qty, 0);

  const getOrderStatus = () => {
    if (isDelivered) return { status: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" };
    if (isPaid) return { status: "Processing", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" };
    return { status: "Pending Payment", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" };
  };

  const orderStatus = getOrderStatus();

  const handleDownloadInvoice = () => {
    downloadInvoice({
      order,
      user,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/user/orders" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Order {formatId(id)}
                </h1>
                <p className="text-muted-foreground">
                  Placed on {formatDateTime(createdAt).dateTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={orderStatus.color}>
                {orderStatus.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card className="dashboard-card animate-fade-in-up border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Order Placed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(createdAt).dateTime}
                      </p>
                    </div>
                  </div>

                  {isPaid && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Payment Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(paidAt!).dateTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {isDelivered && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Order Delivered</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(deliveredAt!).dateTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {!isPaid && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Awaiting Payment</p>
                        <p className="text-sm text-muted-foreground">
                          Payment method: {paymentMethod}
                        </p>
                      </div>
                    </div>
                  )}

                  {isPaid && !isDelivered && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">In Transit</p>
                        <p className="text-sm text-muted-foreground">
                          Your order is being prepared for delivery
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="dashboard-card animate-slide-in-left border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
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
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="dashboard-card animate-slide-in-left border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-card-foreground">{shippingAddress.fullName}</p>
                      <p className="text-muted-foreground">{shippingAddress.streetAddress}</p>
                      <p className="text-muted-foreground">
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p className="text-muted-foreground">{shippingAddress.country}</p>
                    </div>
                    <div>
                      {isDelivered ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          <Truck className="h-3 w-3 mr-1" />
                          In Transit
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="dashboard-card animate-slide-in-left border-0 shadow-md">
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
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border hover:bg-muted/40 transition-colors">
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
                          <Link href={`/product/${item.slug}`} className="block group">
                            <h3 className="font-medium text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
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
              <Card className="dashboard-card animate-slide-in-right border-0 shadow-md">
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
                      <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card className="dashboard-card animate-slide-in-right border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-card-foreground">Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/user/orders/${id}/track`}>
                      <Truck className="h-4 w-4 mr-2" />
                      Track Order
                    </Link>
                  </Button>

                  {isDelivered && (
                    <Button variant="outline" className="w-full">
                      <Receipt className="h-4 w-4 mr-2" />
                      Leave Review
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>

                  {!isPaid && (
                    <Button className="w-full" asChild>
                      <Link href={`/order/${id}`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete Payment
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Order Protection */}
              <Card className="dashboard-card animate-slide-in-right border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="font-medium text-card-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Order Protection
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>30-day return guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Customer support available</span>
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

export default UserOrderDetails;