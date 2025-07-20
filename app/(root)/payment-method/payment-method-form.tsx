"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, CreditCard, Lock, Shield, Smartphone, Wallet, Zap } from "lucide-react";
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
      toast({
        title: "Payment method selected",
        description: "Redirecting to order review...",
      });
      setTimeout(() => {
        router.push("/place-order");
      }, 1000);
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

  const getPaymentDescription = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "card":
        return "Visa, Mastercard, American Express accepted";
      case "paypal":
        return "Pay securely with your PayPal account";
      case "wallet":
        return "Digital wallet payment solution";
      case "apple pay":
        return "Touch ID or Face ID authentication";
      case "google pay":
        return "Quick and secure mobile payment";
      default:
        return "Secure payment processing";
    }
  };

  const getPaymentFeatures = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "card":
        return ["Instant processing", "Fraud protection", "Cashback eligible"];
      case "paypal":
        return ["Buyer protection", "No card details shared", "Instant transfer"];
      case "wallet":
        return ["Contactless payment", "Instant confirmation", "Secure encryption"];
      case "apple pay":
        return ["Biometric security", "No card numbers stored", "One-touch payment"];
      case "google pay":
        return ["Bank-level security", "Quick checkout", "Reward points"];
      default:
        return ["Secure processing", "Encrypted data", "Fraud protection"];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Method</h1>
              <p className="text-muted-foreground">Choose how you'd like to pay securely</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border bg-card mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <CreditCard className="h-5 w-5" />
              Select Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                  className={`relative rounded-lg border-2 transition-colors duration-200 ${field.value === paymentMethod
                                    ? "border-primary bg-muted/30"
                                    : "border-border bg-card"
                                    }`}
                                >
                                  <FormControl>
                                    <RadioGroupItem value={paymentMethod} className="sr-only" />
                                  </FormControl>
                                  <div className="p-4">
                                    <div className="flex items-start gap-4">
                                      {/* Icon Container */}
                                      <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${field.value === paymentMethod
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground"
                                          }`}
                                      >
                                        {getPaymentIcon(paymentMethod)}
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                          <h3 className="font-semibold text-card-foreground text-base">
                                            {paymentMethod}
                                          </h3>
                                          {/* Selection Indicator */}
                                          <div
                                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-200 ${field.value === paymentMethod
                                              ? "border-primary bg-primary"
                                              : "border-border"
                                              }`}
                                          >
                                            {field.value === paymentMethod && (
                                              <Check className="w-3 h-3 text-primary-foreground" />
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {getPaymentDescription(paymentMethod)}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2">
                                          {getPaymentFeatures(paymentMethod).map((feature, index) => (
                                            <span
                                              key={index}
                                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted/50 text-muted-foreground border"
                                            >
                                              {feature}
                                            </span>
                                          ))}
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
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                {/* Security Notice */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Secure Payment Processing</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment information is encrypted with bank-level security and never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 text-base font-medium bg-primary text-primary-foreground transition-colors duration-200 disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continue to Review Order
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">SSL Encrypted</p>
              <p className="text-xs text-muted-foreground">256-bit security</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
            <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">PCI Compliant</p>
              <p className="text-xs text-muted-foreground">Industry standard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
            <Zap className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Instant Processing</p>
              <p className="text-xs text-muted-foreground">Real-time verification</p>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our <span className="underline">terms of service</span> and{" "}
            <span className="underline">privacy policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
