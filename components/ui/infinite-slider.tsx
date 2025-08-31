"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

interface InfiniteSliderProps {
  children: ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  gap?: string;
  pauseOnHover?: boolean;
}

export function InfiniteSlider({
  children,
  speed = 30,
  direction = "left",
  className,
  gap = "4rem",
  pauseOnHover = true
}: InfiniteSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const slider = sliderRef.current;
    if (!slider) return;

    // Set CSS custom properties for animation
    slider.style.setProperty('--animation-duration', `${speed}s`);
    slider.style.setProperty('--animation-direction', direction === 'left' ? 'normal' : 'reverse');
  }, [speed, direction, isClient]);

  if (!isClient) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <div className="flex" style={{ gap }}>
          {children.map((child, index) => (
            <div key={index} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        ref={sliderRef}
        className="flex animate-infinite-scroll"
        style={{
          gap,
          animationDuration: `${speed}s`,
          animationDirection: direction === 'left' ? 'normal' : 'reverse'
        }}
      >
        {/* First set of items */}
        {children.map((child, index) => (
          <div key={`first-${index}`} className="flex-shrink-0">
            {child}
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {children.map((child, index) => (
          <div key={`second-${index}`} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}