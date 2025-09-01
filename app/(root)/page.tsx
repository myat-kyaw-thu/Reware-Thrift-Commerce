import { auth } from "@/auth";
import { getLatestProducts } from "@/lib/actions/product.action";
import { redirect } from "next/navigation";
import LandingPage from './landing-page';

export default async function Home() {
  // Check if user is authenticated
  const session = await auth();

  // If user is authenticated, redirect to user dashboard
  if (session?.user) {
    redirect('/user');
  }

  // If not authenticated, show landing page
  const latestProducts = await getLatestProducts();

  return <LandingPage products={latestProducts} />;
}
