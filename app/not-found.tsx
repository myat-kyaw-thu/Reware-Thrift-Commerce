"use client"

import { ArrowLeft, FileQuestion } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="space-y-6 px-4">
        <div className="relative mx-auto h-40 w-40 animate-pulse rounded-full bg-gray-100">
          <FileQuestion className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform text-6xl font-bold">404</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page not found</h1>
          <p className="mx-auto max-w-[500px] text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Go to homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
