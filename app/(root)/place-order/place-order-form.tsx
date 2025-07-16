"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        disabled={pending}
        className="w-full h-12 text-base font-semibold bg-slate-900 text-white disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {pending ? (
          <>
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-5 h-5 mr-2" />
            Place Order
          </>
        )}
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
