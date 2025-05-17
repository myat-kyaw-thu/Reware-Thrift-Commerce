"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[]
  title?: string
  limit?: number
}) => {
  const [visibleItems, setVisibleItems] = useState(limit || 8)
  const limitedData = data.slice(0, visibleItems)
  const hasMore = data.length > visibleItems

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const loadMore = () => {
    setVisibleItems((prev) => prev + 4)
  }

  return (
    <section className="py-12">
      {title && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {data.length > 4 && (
            <Button variant="ghost" size="sm" className="group">
              View all
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      )}

      {data.length > 0 ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {limitedData.map((product: Product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </motion.div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="px-8 transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Load more products
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </section>
  )
}

export default ProductList
