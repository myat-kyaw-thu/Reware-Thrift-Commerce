"use client"

import { useEffect, useState } from "react"

export default function LoaderPage() {
  const [dots, setDots] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-t-2 border-b-2 border-gray-500" />
        <div className="absolute h-24 w-24 animate-pulse rounded-full border-2 border-dashed border-gray-500 opacity-30" />
      </div>
      <div className="mt-4 text-center font-mono text-sm text-gray-700">Loading{Array(dots).fill(".").join("")}</div>
    </div>
  )
}
