"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Eye, Package } from "lucide-react";
import Link from "next/link";

// Serialized order type for client components
interface SerializedOrder {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
  totalPrice: string; // Converted from Decimal to string
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
}

interface RecentOrdersProps {
  orders: SerializedOrder[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const getStatusColor = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    if (isPaid) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  };

  const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) return "Delivered";
    if (isPaid) return "Processing";
    return "Pending Payment";
  };

  return (
    <Card className="dashboard-card animate-slide-in-left shadow-md border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Recent Orders
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/user/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button className="mt-4" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-foreground">
                      Order #{order.id.slice(-8)}
                    </p>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(order.isPaid, order.isDelivered)}
                    >
                      {getStatusText(order.isPaid, order.isDelivered)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{formatCurrency(Number(order.totalPrice))}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/user/orders/${order.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};