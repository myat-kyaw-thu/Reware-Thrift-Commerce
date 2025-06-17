import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyCart } from '@/lib/actions/cart.actions';
import ProductCartTable from './product-cart-table';

export default async function CartPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        <div className="bg-background border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductCartTable cart={cart} />
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${cart.taxPrice}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${cart.totalPrice}</span>
                </div>
              </div>

              <form action="/shipping-address" method="get" className="w-full mt-6">
                <button
                  type="submit"
                  className="w-full bg-foreground text-background hover:opacity-90 py-2 rounded-md transition-opacity"
                >
                  Proceed to Checkout
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
