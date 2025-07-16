"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, CreditCard, Loader, Shield, Smartphone, Wallet } from "lucide-react";
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
        return <CreditCard className="w-6 h-6" />;
      case "paypal":
      case "wallet":
        return <Wallet className="w-6 h-6" />;
      case "apple pay":
      case "google pay":
        return <Smartphone className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getPaymentDescription = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "card":
        return "Visa, Mastercard, American Express";
      case "paypal":
        return "Pay with your PayPal account";
      case "wallet":
        return "Digital wallet payment";
      case "apple pay":
        return "Touch ID or Face ID required";
      case "google pay":
        return "Quick and secure payment";
      default:
        return "Secure payment processing";
    }
  };

  return (
    <div className="min-h-screen  p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Method</h1>
          <p className="text-gray-600 text-base">Choose how you'd like to pay securely</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <Form {...form}>
            <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <FormItem key={paymentMethod} className="space-y-0">
                            <FormLabel className="cursor-pointer block">
                              <div
                                className={`
                                  relative rounded-2xl border-2 transition-colors duration-200
                                  ${field.value === paymentMethod
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                  }
                                `}
                              >
                                <FormControl>
                                  <RadioGroupItem value={paymentMethod} className="sr-only" />
                                </FormControl>

                                <div className="flex items-center p-5">
                                  {/* Icon Container */}
                                  <div
                                    className={`
                                      flex items-center justify-center w-14 h-14 rounded-2xl transition-colors duration-200
                                      ${field.value === paymentMethod
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600"
                                      }
                                    `}
                                  >
                                    {getPaymentIcon(paymentMethod)}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 ml-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{paymentMethod}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                          {getPaymentDescription(paymentMethod)}
                                        </p>
                                      </div>

                                      {/* Selection Indicator */}
                                      <div
                                        className={`
                                          flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-200
                                          ${field.value === paymentMethod
                                            ? "border-gray-900 bg-gray-900"
                                            : "border-gray-300"
                                          }
                                        `}
                                      >
                                        {field.value === paymentMethod && <Check className="w-3.5 h-3.5 text-white" />}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="mt-3 text-sm" />
                  </FormItem>
                )}
              />

              {/* Security Notice */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl mt-6">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">Your payment information is encrypted and protected</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 text-base font-semibold rounded-2xl bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 mt-6"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-5 h-5 animate-spin mr-3" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">By continuing, you agree to our terms of service and privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
