'use client';

import { Button } from '@/components/ui/button';
import { removeItemFromCart } from '@/lib/actions/cart.actions';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';

type CartItem = {
  productId: string;
  name: string;
  price: string;
  image: string;
  qty: number;
  slug: string;
};

type Cart = {
  id: string;
  items: CartItem[];
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
};

export default function ProductCartTable({ cart }: { cart: Cart; }) {
  const [isPending, startTransition] = useTransition();

  const handleRemoveItem = (productId: string) => {
    startTransition(async () => {
      await removeItemFromCart(productId);
    });
  };

  const handleRemoveAllItems = (productId: string, qty: number) => {
    startTransition(async () => {
      for (let i = 0; i < qty; i++) {
        await removeItemFromCart(productId);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Header - Hidden on mobile, shown on desktop */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/30 rounded-lg border">
        <div className="col-span-6">
          <span className="text-sm font-medium text-muted-foreground">Product</span>
        </div>
        <div className="col-span-3 text-center">
          <span className="text-sm font-medium text-muted-foreground">Quantity</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="bg-card border rounded-lg p-4 md:p-6 transition-colors duration-200"
          >
            {/* Mobile Layout */}
            <div className="md:hidden space-y-4">
              {/* Product Info */}
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted border flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${item.price} each
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In stock • Ships in 2-3 days
                  </p>
                </div>
              </div>

              {/* Quantity and Price Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Qty:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-border bg-transparent"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={isPending || item.qty <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-border bg-transparent"
                      disabled={isPending}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-card-foreground">
                    ${(parseFloat(item.price) * item.qty).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => handleRemoveAllItems(item.productId, item.qty)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove item
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
              {/* Product Info */}
              <div className="col-span-6 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted border flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg?height=64&width=64"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-card-foreground line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ${item.price} each
                  </p>
                  <p className="text-xs text-muted-foreground">
                    In stock • Ships in 2-3 days
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-3 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border bg-transparent"
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={isPending || item.qty <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.qty}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border bg-transparent"
                  disabled={isPending}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Total Price */}
              <div className="col-span-2 text-right">
                <p className="font-semibold text-card-foreground">
                  ${(parseFloat(item.price) * item.qty).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => handleRemoveAllItems(item.productId, item.qty)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Updating cart...</span>
          </div>
        </div>
      )}
    </div>
  );
}
