"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  Star,
  TrendingUp
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalSpent: number;
    totalReviews: number;
    favoriteProducts: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Reviews Written",
      value: stats.totalReviews,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      title: "Favorite Items",
      value: stats.favoriteProducts,
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card
          key={item.title}
          className="dashboard-card stat-card animate-fade-in-up border-0 shadow-md"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};