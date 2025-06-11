import { getMyCart } from '@/lib/actions/cart.actions';
import Header from "../../components/shared/header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await getMyCart();
  console.log("Cart items:", res);
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        {children}
      </main>

    </div>
  );
}
