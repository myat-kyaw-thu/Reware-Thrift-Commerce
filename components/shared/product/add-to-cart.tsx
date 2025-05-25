"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ShoppingCart, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AddToCartProps {
  cart: any
  item: {
    productId: string
    name: string
    slug: string
    price: number
    qty: number
    image: string
  }
}

const AddToCart = ({ cart, item }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsAdded(true)
      toast({
        description: "Added to cart successfully!",
        className: "bg-green-50 border-green-200 text-green-800",
      })

      // Reset after animation
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add to cart. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-20 text-center font-medium transition-all duration-200 focus:scale-105"
            min="1"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isAdded}
        className={cn(
          "w-full h-12 text-base font-medium relative overflow-hidden group",
          "bg-gradient-to-r from-primary to-primary/90",
          "hover:from-primary/90 hover:to-primary",
          "transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          isAdded && "bg-green-600 hover:bg-green-600",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding to Cart...
          </>
        ) : isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5 animate-in zoom-in duration-300" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="transition-all duration-200 hover:scale-105 hover:shadow-md">
          Add to Wishlist
        </Button>
        <Button variant="outline" className="transition-all duration-200 hover:scale-105 hover:shadow-md">
          Compare
        </Button>
      </div>
    </div>
  )
}

export default AddToCart
