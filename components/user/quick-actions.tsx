"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Package,
  Settings,
  ShoppingBag,
  Star,
  User
} from "lucide-react";
import Link from "next/link";

export const QuickActions = () => {
  const actions = [
    {
      title: "My Orders",
      description: "Track your orders",
      icon: Package,
      href: "/user/orders",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Wishlist",
      description: "Saved items",
      icon: Heart,
      href: "/user/wishlist",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    {
      title: "Reviews",
      description: "Your reviews",
      icon: Star,
      href: "/user/reviews",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      title: "Profile",
      description: "Account settings",
      icon: User,
      href: "/user/profile",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Cart",
      description: "View cart items",
      icon: ShoppingBag,
      href: "/cart",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Settings",
      description: "Preferences",
      icon: Settings,
      href: "/user/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-950/20"
    }
  ];

  return (
    <Card className="dashboard-card animate-slide-in-right shadow-md border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 transition-all duration-300"
              asChild
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={action.href}>
                <div className={`p-3 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground text-sm">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};