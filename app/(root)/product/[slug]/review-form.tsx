"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createUpdateReview, getReviewByProductId } from "@/lib/actions/review.actions";
import { reviewFormDefaultValues } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { insertReviewSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, Edit3, Loader2, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";

const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void; }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onRatingChange(index + 1)}
          className="p-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors duration-200",
              index < rating
                ? "text-graphite-700 fill-graphite-700 dark:text-graphite-300 dark:fill-graphite-300"
                : "text-graphite-300 dark:text-graphite-600",
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
      </span>
    </div>
  );
};

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [formProgress, setFormProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const watchedFields = watch();

  // Calculate form completion progress
  useEffect(() => {
    const fields = ["title", "description", "rating"];
    const filledFields = fields.filter((field) => {
      const value = watchedFields?.[field as keyof typeof watchedFields];
      return value && value.toString().trim() !== "" && (field !== "rating" || Number(value) > 0);
    });
    setFormProgress((filledFields.length / fields.length) * 100);
  }, [watchedFields]);

  const handleOpenForm = async () => {
    setIsLoadingReview(true);
    form.setValue("productId", productId);
    form.setValue("userId", userId);

    try {
      const review = await getReviewByProductId({ productId });
      if (review) {
        setExistingReview(review);
        form.setValue("title", review.title);
        form.setValue("description", review.description);
        form.setValue("rating", review.rating);
      } else {
        setExistingReview(null);
        form.reset(reviewFormDefaultValues);
        form.setValue("productId", productId);
        form.setValue("userId", userId);
      }
    } catch (error) {
      console.error("Failed to load existing review:", error);
    } finally {
      setIsLoadingReview(false);
      setOpen(true);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
    try {
      const res = await createUpdateReview({ ...values, productId });
      if (!res.success) {
        return toast({
          variant: "destructive",
          title: "Error submitting review",
          description: res.message,
        });
      }
      setOpen(false);
      onReviewSubmitted();
      toast({
        title: existingReview ? "Review updated successfully" : "Review submitted successfully",
        description: "Thank you for sharing your feedback!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    }
  };

  const getRatingDescription = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor - Not satisfied";
      case 2:
        return "Fair - Below expectations";
      case 3:
        return "Good - Meets expectations";
      case 4:
        return "Very Good - Exceeds expectations";
      case 5:
        return "Excellent - Outstanding";
      default:
        return "";
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenForm}
        disabled={isLoadingReview}
        className="bg-primary text-primary-foreground transition-colors duration-200 disabled:opacity-50"
      >
        {isLoadingReview ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Edit3 className="mr-2 h-4 w-4" />
            {existingReview ? "Edit Review" : "Write Review"}
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {existingReview ? "Edit Your Review" : "Write a Review"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {existingReview
                        ? "Update your review to reflect your current experience"
                        : "Share your experience and help other customers make informed decisions"}
                    </DialogDescription>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Form Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(formProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${formProgress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {isValid && formProgress === 100 ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Ready to submit</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Please complete all fields</span>
                      </>
                    )}
                  </div>
                </div>

                {existingReview && (
                  <Badge variant="secondary" className="w-fit bg-muted text-muted-foreground">
                    Editing existing review
                  </Badge>
                )}
              </DialogHeader>

              <div className="grid gap-6 py-6">
                {/* Rating Field */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Overall Rating <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <StarRating rating={field.value} onRatingChange={(rating) => field.onChange(rating)} />
                          {field.value > 0 && (
                            <div className="bg-muted/30 rounded-lg p-3 border">
                              <p className="text-sm text-muted-foreground">{getRatingDescription(field.value)}</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Review Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="Summarize your experience in a few words..."
                            {...field}
                            className={cn(
                              "bg-background border-border text-foreground transition-colors duration-200",
                              errors.title ? "border-destructive focus:border-destructive" : "focus:border-primary",
                            )}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Be specific and helpful</span>
                            <span>{field.value?.length || 0}/100</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Detailed Review <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Tell us about your experience with this product. What did you like or dislike? How does it compare to similar products?"
                            className={cn(
                              "min-h-[120px] resize-none bg-background border-border text-foreground transition-colors duration-200",
                              errors.description
                                ? "border-destructive focus:border-destructive"
                                : "focus:border-primary",
                            )}
                            {...field}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Share details that would help other customers</span>
                            <span>{field.value?.length || 0}/500</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* Review Guidelines */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Review Guidelines</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Focus on the product's features, quality, and performance</li>
                    <li>• Be honest and constructive in your feedback</li>
                    <li>• Avoid personal information or inappropriate content</li>
                    <li>• Help other customers make informed decisions</li>
                  </ul>
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="bg-transparent border-border text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !isValid}
                  className="bg-primary text-primary-foreground transition-colors duration-200 disabled:opacity-50 min-w-[140px]"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {existingReview ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>{existingReview ? "Update Review" : "Submit Review"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewForm;
