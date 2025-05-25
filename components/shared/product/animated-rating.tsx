"use client"

import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

interface AnimatedRatingProps {
  value: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

const Rating = ({ value, maxRating = 5, size = "md", showValue = false, className }: AnimatedRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(value)
          const isPartial = index === Math.floor(value) && value % 1 !== 0

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-300",
                  isFilled ? "text-yellow-400 fill-yellow-400 animate-in zoom-in" : "text-muted-foreground/30",
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              />
              {isPartial && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${(value % 1) * 100}%` }}>
                  <Star
                    className={cn(sizeClasses[size], "text-yellow-400 fill-yellow-400 transition-all duration-300")}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showValue && (
        <span className={cn("font-medium text-muted-foreground ml-2", textSizeClasses[size])}>{value.toFixed(1)}</span>
      )}
    </div>
  )
}

export default Rating
