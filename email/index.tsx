import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
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
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface PurchaseReceiptEmailProps {
  order: Order;
}

const PurchaseReceiptEmail = ({ order }: PurchaseReceiptEmailProps) => {
  const {
    id,
    user,
    orderitems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    createdAt,
  } = order;

  const itemCount = orderitems.reduce((total, item) => total + item.qty, 0);

  return (
    <Html>
      <Head />
      <Preview>Your ReWear order #{formatId(id)} has been confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Heading style={h1}>ReWear</Heading>
                <Text style={tagline}>Sustainable Fashion Forward</Text>
              </Column>
            </Row>
          </Section>

          {/* Order Confirmation */}
          <Section style={orderSection}>
            <Heading style={h2}>Order Confirmed!</Heading>
            <Text style={paragraph}>
              Hi {user.name}, thank you for your order. We're preparing your items and will notify you when they ship.
            </Text>

            <div style={orderInfo}>
              <Text style={orderNumber}>Order #{formatId(id)}</Text>
              <Text style={orderDate}>Placed on {formatDateTime(createdAt).dateTime}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={itemsSection}>
            <Heading style={h3}>
              Order Items ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Heading>
            {orderitems.map((item) => (
              <div key={item.slug} style={itemRow}>
                <Row>
                  <Column style={itemImageColumn}>
                    <Img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      style={itemImage}
                      width="80"
                      height="80"
                    />
                  </Column>
                  <Column style={itemDetailsColumn}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemDetails}>
                      Quantity: {item.qty} × {formatCurrency(item.price)}
                    </Text>
                  </Column>
                  <Column style={itemPriceColumn}>
                    <Text style={itemPrice}>{formatCurrency(Number.parseFloat(item.price) * item.qty)}</Text>
                  </Column>
                </Row>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Order Summary */}
          <Section style={summarySection}>
            <Heading style={h3}>Order Summary</Heading>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>{formatCurrency(itemsPrice)}</Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Shipping</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>
                  {Number.parseFloat(shippingPrice) === 0 ? "Free" : formatCurrency(shippingPrice)}
                </Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Tax</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={summaryValue}>{formatCurrency(taxPrice)}</Text>
              </Column>
            </Row>
            <Hr style={summaryHr} />
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column style={summaryValueColumn}>
                <Text style={totalValue}>{formatCurrency(totalPrice)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Shipping & Payment Info */}
          <Section style={infoSection}>
            <Row>
              <Column style={infoColumn}>
                <Heading style={h4}>Shipping Address</Heading>
                <Text style={addressText}>
                  {shippingAddress.fullName}
                  <br />
                  {shippingAddress.streetAddress}
                  <br />
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                </Text>
              </Column>
              <Column style={infoColumn}>
                <Heading style={h4}>Payment Method</Heading>
                <Text style={paymentText}>{paymentMethod}</Text>
                <Text style={deliveryText}>📦 Estimated delivery: 2-3 business days</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Action Buttons */}
          <Section style={buttonSection}>
            <Link style={primaryButton} href={`${process.env.NEXT_PUBLIC_SERVER_URL}/order/${id}`}>
              Track Your Order
            </Link>
            <Link style={secondaryButton} href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products`}>
              Continue Shopping
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions about your order? Contact us at{" "}
              <Link href="mailto:support@rewear.com" style={footerLink}>
                support@rewear.com
              </Link>
            </Text>
            <Text style={footerText}>
              Thank you for choosing ReWear - together we're making fashion more sustainable.
            </Text>
            <Text style={footerCopyright}>© 2024 ReWear. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles using graphite color scheme
const main = {
  backgroundColor: "#f8f9fa",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
  borderRadius: "8px 8px 0 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 8px",
  letterSpacing: "-0.5px",
};

const tagline = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
  fontWeight: "400",
};

const orderSection = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const orderInfo = {
  backgroundColor: "#f3f4f6",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const orderNumber = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const orderDate = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const itemsSection = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
};

const h3 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 24px",
};

const h4 = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const itemRow = {
  padding: "16px 0",
  borderBottom: "1px solid #f3f4f6",
};

const itemImageColumn = {
  width: "80px",
  verticalAlign: "top" as const,
};

const itemImage = {
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const itemDetailsColumn = {
  paddingLeft: "16px",
  verticalAlign: "top" as const,
};

const itemPriceColumn = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const itemName = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 8px",
};

const itemDetails = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const itemPrice = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};

const summarySection = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
};

const summaryRow = {
  marginBottom: "12px",
};

const summaryLabel = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const summaryValueColumn = {
  textAlign: "right" as const,
};

const summaryValue = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const summaryHr = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const totalRow = {
  marginTop: "16px",
};

const totalLabel = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};

const totalValue = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const infoSection = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
};

const infoColumn = {
  width: "50%",
  paddingRight: "12px",
  verticalAlign: "top" as const,
};

const addressText = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const paymentText = {
  color: "#1a1a1a",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px",
};

const deliveryText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
};

const buttonSection = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};

const primaryButton = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 8px 16px",
  minWidth: "200px",
};

const secondaryButton = {
  backgroundColor: "transparent",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#374151",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 8px",
  minWidth: "200px",
};

const footer = {
  padding: "32px 24px",
  backgroundColor: "#ffffff",
  borderRadius: "0 0 8px 8px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const footerLink = {
  color: "#1a1a1a",
  textDecoration: "underline",
};

const footerCopyright = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "16px 0 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

export default PurchaseReceiptEmail;
