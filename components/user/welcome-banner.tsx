"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

interface WelcomeBannerProps {
  userName?: string;
}

export const WelcomeBanner = ({ userName }: WelcomeBannerProps) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg mb-8 animate-scale-in">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {getGreeting()}{userName ? `, ${userName}` : ''}!
              </h1>
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              Welcome back to your dashboard. Discover new products and manage your orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link href="/products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/user/orders">
                  View Orders
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};