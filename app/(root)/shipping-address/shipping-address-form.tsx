"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateUserAddress } from '@/lib/actions/user.action';
import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import type { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Check, Loader, MapPin, Save } from "lucide-react";
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
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shipping Address</h1>
          <p className="mt-2 text-lg text-gray-600">Where should we deliver your order?</p>
        </div>

        {/* Progress Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Form Completion</span>
              <span className="text-sm text-gray-500">{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
            <div className="mt-2 flex items-center gap-2">
              {isAutoSaving && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Save className="h-3 w-3 animate-pulse" />
                  Auto-saving...
                </div>
              )}
              {hasUnsavedChanges && !isAutoSaving && (
                <Badge variant="outline" className="text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                      <FormLabel className="flex items-center gap-2">
                        Full Name
                        {isFieldValid("fullName") && <Check className="h-4 w-4 text-green-500" />}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your full name"
                            className={`transition-all duration-200 ${getFieldError("fullName")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : isFieldValid("fullName")
                                ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            {...field}
                          />
                          {getFieldError("fullName") && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Street Address
                        {isFieldValid("streetAddress") && <Check className="h-4 w-4 text-green-500" />}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your street address"
                            className={`transition-all duration-200 ${getFieldError("streetAddress")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : isFieldValid("streetAddress")
                                ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            {...field}
                          />
                          {getFieldError("streetAddress") && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
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
                        <FormLabel className="flex items-center gap-2">
                          City
                          {isFieldValid("city") && <Check className="h-4 w-4 text-green-500" />}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter city"
                              className={`transition-all duration-200 ${getFieldError("city")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : isFieldValid("city")
                                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                  : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                              {...field}
                            />
                            {getFieldError("city") && (
                              <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Postal Code
                          {isFieldValid("postalCode") && <Check className="h-4 w-4 text-green-500" />}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter postal code"
                              className={`transition-all duration-200 ${getFieldError("postalCode")
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : isFieldValid("postalCode")
                                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                  : "focus:border-blue-500 focus:ring-blue-500"
                                }`}
                              {...field}
                            />
                            {getFieldError("postalCode") && (
                              <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
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
                      <FormLabel className="flex items-center gap-2">
                        Country
                        {isFieldValid("country") && <Check className="h-4 w-4 text-green-500" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className={`transition-all duration-200 ${getFieldError("country")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : isFieldValid("country")
                                ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                : "focus:border-blue-500 focus:ring-blue-500"
                              }`}
                          >
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isPending || !isValid}
                    className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Continue to Payment
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* Form Status */}
                <div className="text-center text-sm text-gray-500">
                  {!isValid && formProgress > 0 && (
                    <p className="flex items-center justify-center gap-1 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Please complete all required fields
                    </p>
                  )}
                  {isValid && (
                    <p className="flex items-center justify-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      All fields completed correctly
                    </p>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Your information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
