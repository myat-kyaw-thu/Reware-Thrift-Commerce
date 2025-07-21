"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { updateUserAddress } from "@/lib/actions/user.action";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import type { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Check, MapPin, Save, Shield, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { z } from "zod";

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "MX", name: "Mexico" },
];

const ShippingAddressForm = ({ address }: { address: ShippingAddress; }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors, isValid, dirtyFields },
  } = form;

  const watchedFields = watch();

  // Calculate form completion progress
  useEffect(() => {
    const fields = ["fullName", "streetAddress", "city", "postalCode", "country"];
    const filledFields = fields.filter(
      (field) =>
        watchedFields?.[field as keyof typeof watchedFields] &&
        watchedFields?.[field as keyof typeof watchedFields]?.toString().trim() !== "",
    );
    setFormProgress((filledFields.length / fields.length) * 100);
  }, [watchedFields]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = Object.keys(dirtyFields).length > 0;
    setHasUnsavedChanges(hasChanges);
  }, [dirtyFields]);

  // Auto-save functionality (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges || !isValid) return;

    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true);
      // Simulate auto-save
      setTimeout(() => {
        setIsAutoSaving(false);
        toast({
          description: "Changes saved automatically",
          duration: 2000,
        });
      }, 1000);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [watchedFields, hasUnsavedChanges, isValid, toast]);

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);
        if (!res.success) {
          toast({
            variant: "destructive",
            title: "Error updating address",
            description: res.message,
          });
          return;
        }
        toast({
          title: "Address updated successfully",
          description: "Redirecting to payment method...",
        });
        setTimeout(() => {
          router.push("/payment-method");
        }, 1000);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      }
    });
  };

  const getFieldError = (fieldName: string) => {
    return errors?.[fieldName as keyof typeof errors]?.message;
  };

  const isFieldValid = (fieldName: string) => {
    return (
      !errors?.[fieldName as keyof typeof errors] &&
      watchedFields?.[fieldName as keyof typeof watchedFields] &&
      watchedFields?.[fieldName as keyof typeof watchedFields]?.toString().trim() !== ""
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Shipping Address</h1>
              <p className="text-muted-foreground">Where should we deliver your order?</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="mb-6 border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-card-foreground">Form Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="h-2 bg-muted" />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isAutoSaving && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Save className="h-3 w-3" />
                    Auto-saving...
                  </div>
                )}
                {hasUnsavedChanges && !isAutoSaving && (
                  <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                    Unsaved changes
                  </Badge>
                )}
              </div>
              {isValid && formProgress === 100 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="h-3 w-3" />
                  Ready to continue
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <MapPin className="h-5 w-5" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-card-foreground">
                        Full Name
                        {isFieldValid("fullName") && <Check className="h-4 w-4 text-muted-foreground" />}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your full name"
                            className={`bg-background border-border text-foreground transition-colors duration-200 ${getFieldError("fullName")
                              ? "border-destructive focus:border-destructive"
                              : isFieldValid("fullName")
                                ? "border-muted-foreground"
                                : "focus:border-primary"
                              }`}
                            {...field}
                          />
                          {getFieldError("fullName") && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-card-foreground">
                        Street Address
                        {isFieldValid("streetAddress") && <Check className="h-4 w-4 text-muted-foreground" />}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your street address"
                            className={`bg-background border-border text-foreground transition-colors duration-200 ${getFieldError("streetAddress")
                              ? "border-destructive focus:border-destructive"
                              : isFieldValid("streetAddress")
                                ? "border-muted-foreground"
                                : "focus:border-primary"
                              }`}
                            {...field}
                          />
                          {getFieldError("streetAddress") && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* City and Postal Code Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-card-foreground">
                          City
                          {isFieldValid("city") && <Check className="h-4 w-4 text-muted-foreground" />}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter city"
                              className={`bg-background border-border text-foreground transition-colors duration-200 ${getFieldError("city")
                                ? "border-destructive focus:border-destructive"
                                : isFieldValid("city")
                                  ? "border-muted-foreground"
                                  : "focus:border-primary"
                                }`}
                              {...field}
                            />
                            {getFieldError("city") && (
                              <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-card-foreground">
                          Postal Code
                          {isFieldValid("postalCode") && <Check className="h-4 w-4 text-muted-foreground" />}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter postal code"
                              className={`bg-background border-border text-foreground transition-colors duration-200 ${getFieldError("postalCode")
                                ? "border-destructive focus:border-destructive"
                                : isFieldValid("postalCode")
                                  ? "border-muted-foreground"
                                  : "focus:border-primary"
                                }`}
                              {...field}
                            />
                            {getFieldError("postalCode") && (
                              <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-card-foreground">
                        Country
                        {isFieldValid("country") && <Check className="h-4 w-4 text-muted-foreground" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className={`bg-background border-border text-foreground transition-colors duration-200 ${getFieldError("country")
                              ? "border-destructive focus:border-destructive"
                              : isFieldValid("country")
                                ? "border-muted-foreground"
                                : "focus:border-primary"
                              }`}
                          >
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name} className="text-card-foreground">
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                {/* Form Status */}
                <div className="bg-muted/30 rounded-lg p-4">
                  {!isValid && formProgress > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Please complete all required fields to continue</span>
                    </div>
                  )}
                  {isValid && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">All information completed correctly</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending || !isValid}
                  className="w-full h-12 text-base font-medium bg-primary text-primary-foreground transition-colors duration-200 disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continue to Payment
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security & Trust Indicators */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
              <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
              <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
              <Check className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Protected</p>
                <p className="text-xs text-muted-foreground">Safe checkout</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">🔒 Your information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
