"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createOrder();
      if (res.redirectTo) {
        router.push(res.redirectTo);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    const isLoading = pending || isSubmitting;

    return (
      <Button
        disabled={isLoading}
        className="w-full h-12 text-base font-medium bg-primary text-primary-foreground transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Processing Order...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Place Order
          </div>
        )}
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <PlaceOrderButton />
      <div className="text-center">
        <p className="text-xs text-muted-foreground">By placing this order, you agree to our terms and conditions</p>
      </div>
    </form>
  );
};

export default PlaceOrderForm;
