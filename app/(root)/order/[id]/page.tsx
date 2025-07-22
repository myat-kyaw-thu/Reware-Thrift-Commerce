import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import type { ShippingAddress } from "@/types";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({
  params,
}: {
  params: { id: string; };
}) => {
  const { id } = params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();
  // Redirect the user if they don't own the order
  if (
    !session?.user ||
    (order.userId !== session.user.id &&
      (session.user as any).role !== "admin")
  ) {
    return redirect("/unauthorized");
  }

  let client_secret = null;
  // Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-06-30.basil",
    });
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice?.toString?.() ?? order.taxPrice,
        totalPrice: order.totalPrice?.toString?.() ?? order.totalPrice,
        orderitems: order.orderitems.map((item: any) => ({
          ...item,
          price: item.price.toString(),
        })),
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={((session?.user as any)?.role === "admin") || false}
    />
  );
};

export default OrderDetailsPage;
