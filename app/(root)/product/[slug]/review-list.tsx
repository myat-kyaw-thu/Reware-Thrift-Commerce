'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/types';
import Link from 'next/link';
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, User, MessageSquare, Star } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';
import { cn } from '@/lib/utils';

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
        console.error('Failed to load reviews:', error);
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="h-6 w-3/4 bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="h-4 w-20 bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gradient-to-r from-muted to-muted/50 rounded animate-pulse" />
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">Customer Reviews</h3>
          <p className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        {userId && (
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewSubmitted={reload}
          />
        )}
      </div>

      {/* Sign In Prompt */}
      {!userId && (
        <Card className="border-dashed border-2 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <p className="text-lg font-medium mb-2">Share Your Experience</p>
            <p className="text-muted-foreground mb-4">
              Help other customers by writing a review
            </p>
            <Link
              href={`/sign-in?callbackUrl=/product/${productSlug}`}
              className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Sign in to review
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {reviews.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl" />
              <Star className="relative h-16 w-16 text-muted-foreground/40" />
            </div>
            <h4 className="text-xl font-semibold mb-2">No reviews yet</h4>
            <p className="text-muted-foreground max-w-sm">
              Be the first to share your thoughts about this product
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews Grid */}
      <div className="grid gap-6">
        {reviews.map((review, index) => (
          <Card
            key={review.id}
            className={cn(
              "group overflow-hidden border-0 bg-gradient-to-br from-card to-card/50",
              "hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
              "hover:-translate-y-1 hover:scale-[1.02]",
              "animate-in fade-in slide-in-from-bottom-4"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                    {review.title}
                  </CardTitle>
                  <Rating value={review.rating} className="scale-110" />
                </div>
              </div>

              <CardDescription className="text-base leading-relaxed">
                {review.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 group/item hover:text-foreground transition-colors duration-200">
                  <User className="h-3.5 w-3.5 group-hover/item:scale-110 transition-transform duration-200" />
                  <span className="font-medium">
                    {review.user ? review.user.name : 'Anonymous User'}
                  </span>
                </div>

                <div className="flex items-center gap-2 group/item hover:text-foreground transition-colors duration-200">
                  <Calendar className="h-3.5 w-3.5 group-hover/item:scale-110 transition-transform duration-200" />
                  <span>{formatDateTime(review.createdAt).dateTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
