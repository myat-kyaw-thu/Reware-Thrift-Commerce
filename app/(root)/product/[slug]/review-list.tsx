"use client";

import Rating from "@/components/shared/product/animated-rating";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getReviews } from "@/lib/actions/review.actions";
import { formatDateTime } from "@/lib/utils";
import type { Review } from "@/types";
import { Calendar, MessageSquare, Star, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        const res = await getReviews({ productId });
        setReviews(res.data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  // Calculate review statistics
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border bg-card">
            <CardHeader className="space-y-3">
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-foreground">Customer Reviews</h3>
          <p className="text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"} • Average rating {averageRating.toFixed(1)}
          </p>
        </div>
        {userId && <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />}
      </div>

      {/* Review Statistics */}
      {reviews.length > 0 && (
        <Card className="border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <TrendingUp className="h-5 w-5" />
              Review Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="text-3xl font-bold text-card-foreground">{averageRating.toFixed(1)}</span>
                  <Rating value={averageRating} size="lg" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-muted-foreground">{rating}</span>
                      <Star className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign In Prompt */}
      {!userId && (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Share Your Experience</h4>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Help other customers by writing a detailed review about this product
            </p>
            <Link
              href={`/sign-in?callbackUrl=/product/${productSlug}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors duration-200"
            >
              Sign in to Write Review
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {reviews.length === 0 && (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h4>
            <p className="text-muted-foreground max-w-sm">
              Be the first to share your thoughts and help other customers make informed decisions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          <Separator />
          <div className="grid gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border bg-card">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Rating value={review.rating} size="sm" />
                        <span className="text-sm text-muted-foreground">{review.rating} out of 5 stars</span>
                      </div>
                      <CardTitle className="text-lg text-card-foreground leading-tight">{review.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {review.description}
                  </CardDescription>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-medium">{review.user ? review.user.name : "Anonymous User"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateTime(review.createdAt).dateTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Verified Purchase</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
