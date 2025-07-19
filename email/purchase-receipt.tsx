import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

type OrderInformationProps = {
  order: Order;
};

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>Your order has been confirmed - Thank you for your purchase!</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-br from-slate-50 to-gray-100 font-sans">
          <Container className="max-w-2xl mx-auto my-8">
            {/* Main Card Container */}
            <Section className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header Section */}
              <Section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12 text-center">
                <Heading className="text-white text-3xl font-bold mb-3 tracking-tight">Order Confirmed! ✨</Heading>
                <Text className="text-indigo-100 text-lg font-medium">
                  Thank you for choosing us, {order.user.name}
                </Text>
              </Section>

              {/* Order Info Cards */}
              <Section className="px-8 py-8">
                <Row className="gap-4">
                  <Column className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                    <Text className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">Order Number</Text>
                    <Text className="text-blue-900 text-xl font-bold">
                      #{order.id.toString().slice(-8).toUpperCase()}
                    </Text>
                  </Column>

                  <Column className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200">
                    <Text className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">Order Date</Text>
                    <Text className="text-emerald-900 text-xl font-bold">{dateFormatter.format(order.createdAt)}</Text>
                  </Column>

                  <Column className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200">
                    <Text className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">Total Amount</Text>
                    <Text className="text-amber-900 text-xl font-bold">{formatCurrency(order.totalPrice)}</Text>
                  </Column>
                </Row>
              </Section>

              {/* Order Items */}
              <Section className="px-8 pb-8">
                <Heading className="text-2xl font-bold text-gray-900 mb-6 flex items-center">🛍️ Your Items</Heading>

                <Section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {order.orderitems.map((item, index) => (
                    <Row
                      key={item.productId}
                      className={`p-6 ${index !== order.orderitems.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <Column className="w-20">
                        <Img
                          src={
                            item.image.startsWith("/")
                              ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                              : item.image
                          }
                          alt={item.name}
                          width="80"
                          height="80"
                          className="rounded-xl object-cover shadow-md border border-gray-200"
                        />
                      </Column>

                      <Column className="pl-6 align-top">
                        <Text className="text-gray-900 text-lg font-semibold mb-1 leading-tight">{item.name}</Text>
                        <Text className="text-gray-500 text-sm font-medium">Qty: {item.qty}</Text>
                      </Column>

                      <Column align="right" className="align-top">
                        <Text className="text-gray-900 text-xl font-bold">{formatCurrency(item.price)}</Text>
                      </Column>
                    </Row>
                  ))}
                </Section>
              </Section>

              {/* Order Summary */}
              <Section className="px-8 pb-8">
                <Section className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-8 border border-gray-200">
                  <Heading className="text-xl font-bold text-gray-900 mb-6">💰 Order Summary</Heading>

                  <Row className="mb-4">
                    <Column>
                      <Text className="text-gray-600 text-base font-medium">Subtotal</Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-gray-900 text-base font-semibold">{formatCurrency(order.itemsPrice)}</Text>
                    </Column>
                  </Row>

                  <Row className="mb-4">
                    <Column>
                      <Text className="text-gray-600 text-base font-medium">Shipping</Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-gray-900 text-base font-semibold">
                        {formatCurrency(order.shippingPrice)}
                      </Text>
                    </Column>
                  </Row>

                  <Row className="mb-6">
                    <Column>
                      <Text className="text-gray-600 text-base font-medium">Tax</Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-gray-900 text-base font-semibold">{formatCurrency(order.taxPrice)}</Text>
                    </Column>
                  </Row>

                  <Hr className="border-gray-300 my-6" />

                  <Row>
                    <Column>
                      <Text className="text-gray-900 text-xl font-bold">Total</Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-emerald-600 text-2xl font-bold">{formatCurrency(order.totalPrice)}</Text>
                    </Column>
                  </Row>
                </Section>
              </Section>

              {/* Shipping & Payment Info */}
              <Section className="px-8 pb-8">
                <Row className="gap-4">
                  <Column className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-blue-200">
                    <Heading className="text-lg font-bold text-blue-900 mb-4">🏠 Shipping Address</Heading>
                    <Text className="text-blue-800 font-semibold mb-1">{order.shippingAddress.fullName}</Text>
                    <Text className="text-blue-700 text-sm leading-relaxed">
                      {order.shippingAddress.streetAddress}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                    </Text>
                  </Column>

                  <Column className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                    <Heading className="text-lg font-bold text-green-900 mb-4">💳 Payment Method</Heading>
                    <Text className="text-green-800 font-semibold mb-2">{order.paymentMethod}</Text>
                    {order.isPaid && <Text className="text-green-600 text-sm font-medium">✅ Payment confirmed</Text>}
                  </Column>
                </Row>
              </Section>

              {/* Footer */}
              <Section className="bg-gradient-to-r from-gray-800 to-slate-900 px-8 py-10 text-center">
                <Text className="text-gray-300 text-base mb-3 font-medium">
                  Need help with your order? We're here for you!
                </Text>
                <Text className="text-gray-400 text-sm mb-2">This confirmation was sent to {order.user.email}</Text>
                <Text className="text-gray-500 text-xs">© 2025 Your Store. All rights reserved.</Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
