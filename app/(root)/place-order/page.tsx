import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { formatCurrency } from "@/lib/utils";
import type { ShippingAddress } from "@/types";
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutSteps current={3} />

        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Review Your Order</h1>
          <p className="text-slate-600 mt-2">Please review your order details before placing your order.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Shipping Address</h2>
                  <Link href="/shipping-address">
                    <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-900">{userAddress.fullName}</p>
                  <p className="text-slate-600 mt-1">{userAddress.streetAddress}</p>
                  <p className="text-slate-600">
                    {userAddress.city}, {userAddress.postalCode}
                  </p>
                  <p className="text-slate-600">{userAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Payment Method</h2>
                  <Link href="/payment-method">
                    <Button variant="outline" size="sm" className="text-slate-600 border-slate-300">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-900">{user.paymentMethod}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Items</h2>
                <div className="bg-slate-50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-200">
                        <TableHead className="text-slate-700 font-semibold bg-slate-100">Item</TableHead>
                        <TableHead className="text-slate-700 font-semibold bg-slate-100 text-center">
                          Quantity
                        </TableHead>
                        <TableHead className="text-slate-700 font-semibold bg-slate-100 text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.slug} className="border-slate-200">
                          <TableCell className="py-4">
                            <Link href={`/product/${item.slug}`} className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                              </div>
                              <span className="font-medium text-slate-900">{item.name}</span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full text-sm font-medium text-slate-700">
                              {item.qty}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-900">${item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-0 bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600">Items</span>
                      <span className="font-medium text-slate-900">{formatCurrency(cart.itemsPrice)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600">Tax</span>
                      <span className="font-medium text-slate-900">{formatCurrency(cart.taxPrice)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-medium text-slate-900">{formatCurrency(cart.shippingPrice)}</span>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-xl font-bold text-slate-900">{formatCurrency(cart.totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <PlaceOrderForm />
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
