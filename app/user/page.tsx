import { auth } from "@/auth";
import {
  DashboardStats,
  QuickActions,
  RecentOrders,
  RecommendedProducts,
  WelcomeBanner
} from "@/components/user";
import { getMyOrders } from "@/lib/actions/order.actions";
import { getLatestProducts } from "@/lib/actions/product.action";
import { getUserInfo } from "@/lib/actions/user.action";

export default async function UserHomePage() {
  const session = await auth();

  // Fetch user data in parallel
  const [latestProducts, userOrders, userInfo] = await Promise.all([
    getLatestProducts(),
    session?.user ? getMyOrders({ page: 1 }) : Promise.resolve({ data: [], totalPages: 0 }),
    session?.user ? getUserInfo() : Promise.resolve(null)
  ]);

  // Serialize orders data to convert Decimal objects to strings
  const serializedOrders = userOrders.data.map(order => ({
    ...order,
    itemsPrice: order.itemsPrice.toString(),
    shippingPrice: order.shippingPrice.toString(),
    taxPrice: order.taxPrice.toString(),
    totalPrice: order.totalPrice.toString(),
  }));

  // Mock stats - in a real app, you'd fetch these from your database
  const mockStats = {
    totalOrders: userOrders.data.length,
    totalSpent: userOrders.data.reduce((sum, order) => sum + Number(order.totalPrice), 0),
    totalReviews: 0, // You'd fetch this from reviews table
    favoriteProducts: 0 // You'd fetch this from favorites/wishlist table
  };

  // Get user name safely
  const userName = userInfo && 'data' in userInfo && userInfo.data ? userInfo.data.name : session?.user?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <WelcomeBanner userName={userName || undefined} />

        {/* Dashboard Stats */}
        <DashboardStats stats={mockStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Orders and Products */}
          <div className="xl:col-span-3 space-y-8">
            <RecentOrders orders={serializedOrders} />
            <RecommendedProducts products={latestProducts} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}