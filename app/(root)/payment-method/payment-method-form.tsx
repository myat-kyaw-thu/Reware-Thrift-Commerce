"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CreditCard, Loader, Smartphone, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      router.push("/place-order");
    });
  };

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "paypal":
      case "wallet":
        return <Wallet className="w-5 h-5" />;
      case "apple pay":
      case "google pay":
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-background border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Choose Payment Method</h1>
          <p className="text-muted-foreground text-sm">Select your preferred payment option to continue</p>
        </div>

        <Form {...form}>
          <form method="post" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid gap-3">
                      {PAYMENT_METHODS.map((paymentMethod) => (
                        <FormItem key={paymentMethod} className="space-y-0">
                          <FormLabel className="cursor-pointer">
                            <div
                              className={`
                                relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
                                ${field.value === paymentMethod
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-background"
                                }
                              `}
                            >
                              <FormControl>
                                <RadioGroupItem value={paymentMethod} className="sr-only" />
                              </FormControl>

                              <div
                                className={`
                                flex items-center justify-center w-10 h-10 rounded-full
                                ${field.value === paymentMethod
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                  }
                              `}
                              >
                                {getPaymentIcon(paymentMethod)}
                              </div>

                              <div className="flex-1">
                                <div className="font-medium text-foreground">{paymentMethod}</div>
                              </div>

                              {field.value === paymentMethod && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                </div>
                              )}
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="mt-2" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" disabled={isPending} className="w-full h-12 text-base font-medium rounded-xl">
                {isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
