"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const Rating = ({ value, maxRating = 5, size = "md", showValue = false, reviewCount, className }: RatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(value);
          const isPartial = index === Math.floor(value) && value % 1 !== 0;

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-200",
                  isFilled
                    ? "text-graphite-700 fill-graphite-700 dark:text-graphite-300 dark:fill-graphite-300"
                    : "text-graphite-300 dark:text-graphite-600",
                )}
              />
              {isPartial && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${(value % 1) * 100}%` }}>
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "text-graphite-700 fill-graphite-700 dark:text-graphite-300 dark:fill-graphite-300",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(showValue || reviewCount) && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          {showValue && value.toFixed(1)}
          {reviewCount && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
};

export default Rating;
