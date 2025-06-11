'use client';

import { Button } from '@/components/ui/button';
import { removeItemFromCart } from '@/lib/actions/cart.actions';
import { Minus, Plus, X } from 'lucide-react';
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

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-medium">Product</th>
            <th className="text-center p-4 font-medium">Quantity</th>
            <th className="text-right p-4 font-medium">Price</th>
            <th className="text-right p-4 font-medium w-[50px]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cart.items.map((item) => (
            <tr key={item.productId} className="group">
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted/50">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price} each</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={isPending}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={isPending}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </td>
              <td className="p-4 text-right">
                ${(parseFloat(item.price) * item.qty).toFixed(2)}
              </td>
              <td className="p-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    // Remove all of this item
                    for (let i = 0; i < item.qty; i++) {
                      handleRemoveItem(item.productId);
                    }
                  }}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
