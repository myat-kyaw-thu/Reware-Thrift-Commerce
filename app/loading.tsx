"use client";

import { useEffect, useState } from "react";

export default function LoaderPage() {
  const [progress, setProgress] = useState<number>(0);
  const [dots, setDots] = useState<number>(0);

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          // Slow down at the end to simulate waiting for response
          return prev + (100 - prev) * 0.1;
        }
        return Math.min(prev + Math.random() * 8, 100);
      });
    }, 200);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md"
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center gap-8 px-4">
        {/* Main loader animation */}
        <div className="relative">
          {/* Outer circle */}
          <div className="w-20 h-20 rounded-full border-4 border-muted/30"></div>

          {/* Spinning arc */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          </div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 animate-pulse"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-sm font-medium text-foreground/70">Loading{Array(dots).fill(".").join("")}</div>
      </div>
    </div>
  );
}
