import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ProductPrice from "./product-price"
import type { Product } from "@/types"

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group h-full overflow-hidden rounded-xl border-none bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-zinc-900">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={true}
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <Badge variant="destructive" className="px-3 py-1.5 text-sm font-medium">
                Out of Stock
              </Badge>
            </div>
          )}
        </Link>
      </div>

      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-normal">
            {product.brand}
          </Badge>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5 text-amber-400"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">{Number(product.rating).toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/product/${product.slug}`} className="mt-1">
          <h2 className="line-clamp-2 h-12 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300">
            {product.name}
          </h2>
        </Link>

        <div className="mt-auto pt-2">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-sm font-medium text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
