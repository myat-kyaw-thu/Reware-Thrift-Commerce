import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById } from "@/lib/actions/order.actions";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ id: string; }>;
  searchParams: Promise<{ payment_intent: string; }>;
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if payment intent is valid
  if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) {
    return notFound();
  }

  // Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border bg-card text-center">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Successful!</h1>
                <p className="text-muted-foreground">Thank you for your purchase. We are processing your order.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button asChild className="flex-1">
                  <Link href={`/order/${id}`} className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    View Order
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
