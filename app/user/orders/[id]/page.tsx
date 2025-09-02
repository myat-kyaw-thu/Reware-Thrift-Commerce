import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import type { ShippingAddress } from "@/types";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import UserOrderDetails from "./user-order-details";

export const metadata: Metadata = {
  title: "Order Details",
};

const UserOrderDetailsPage = async ({
  params,
}: {
  params: { id: string; };
}) => {
  const { id } = params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  // Only allow the order owner to view their order details
  if (!session?.user || order.userId !== session.user.id) {
    return redirect("/user/orders");
  }

  return (
    <UserOrderDetails
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
      user={session?.user}
    />
  );
};

export default UserOrderDetailsPage;