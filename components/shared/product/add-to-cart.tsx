"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Check, Loader2, Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { addItemToCart } from "@/lib/actions/cart.actions"


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
      // Call the real addItemToCart function
      await addItemToCart({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: String(item.price),
        qty: quantity,
        image: item.image,
      })

      setIsAdded(true)
      toast({
        description: "Added to cart successfully!",
        variant: "default",
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
        <Label className="text-sm font-medium text-muted-foreground">Quantity</Label>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-12 w-12 rounded-full border-2 hover:scale-110 transition-all duration-200 disabled:hover:scale-100"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex-1 max-w-20">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="text-center font-semibold text-lg h-12 border-2 rounded-xl"
              min="1"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            className="h-12 w-12 rounded-full border-2 hover:scale-110 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isLoading || isAdded}
        size="lg"
        className={cn(
          "w-full h-14 text-lg font-semibold rounded-xl",
          "bg-gradient-to-r from-primary via-primary to-primary/90",
          "hover:from-primary/90 hover:via-primary hover:to-primary",
          "transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
          isAdded && "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-500",
        )}
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Adding to Cart...
          </div>
        ) : isAdded ? (
          <div className="flex items-center">
            <Check className="mr-3 h-5 w-5 animate-in zoom-in duration-300" />
            Added to Cart!
          </div>
        ) : (
          <div className="flex items-center">
            <ShoppingCart className="mr-3 h-5 w-5" />
            Add to Cart • ${(item.price * quantity).toFixed(2)}
          </div>
        )}
      </Button>
    </div>
  )
}

export default AddToCart
