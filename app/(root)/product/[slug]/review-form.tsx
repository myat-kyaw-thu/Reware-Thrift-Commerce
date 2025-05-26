"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { reviewFormDefaultValues } from "@/lib/constants"
import { insertReviewSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { StarIcon, Edit3, Loader2 } from "lucide-react"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { z } from "zod"
import { createUpdateReview, getReviewByProductId } from "@/lib/actions/review.actions"
import { cn } from "@/lib/utils"

const AnimatedStar = ({ filled, index }: { filled: boolean; index: number }) => (
  <StarIcon
    className={cn(
      "h-4 w-4 transition-all duration-300 cursor-pointer",
      filled
        ? "text-yellow-400 fill-yellow-400 scale-110"
        : "text-muted-foreground hover:text-yellow-300 hover:scale-105",
    )}
    style={{
      animationDelay: `${index * 50}ms`,
    }}
  />
)

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string
  productId: string
  onReviewSubmitted: () => void
}) => {
  const [open, setOpen] = useState(false)
  const [isLoadingReview, setIsLoadingReview] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  })

  const handleOpenForm = async () => {
    setIsLoadingReview(true)
    form.setValue("productId", productId)
    form.setValue("userId", userId)

    try {
      const review = await getReviewByProductId({ productId })

      if (review) {
        form.setValue("title", review.title)
        form.setValue("description", review.description)
        form.setValue("rating", review.rating)
      }
    } catch (error) {
      console.error("Failed to load existing review:", error)
    } finally {
      setIsLoadingReview(false)
      setOpen(true)
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
    try {
      const res = await createUpdateReview({ ...values, productId })

      if (!res.success) {
        return toast({
          variant: "destructive",
          description: res.message,
        })
      }

      setOpen(false)
      onReviewSubmitted()

      toast({
        description: res.message,
        className: "bg-green-50 border-green-200 text-green-800",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <>
      <Button
        onClick={handleOpenForm}
        disabled={isLoadingReview}
        className={cn(
          "relative overflow-hidden group",
          "bg-gradient-to-r from-primary to-primary/90",
          "hover:from-primary/90 hover:to-primary",
          "transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isLoadingReview ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Edit3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Write Review
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

          <Form {...form}>
            <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="relative">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Write a Review
                </DialogTitle>
                <DialogDescription className="text-base">
                  Share your experience and help other customers make informed decisions
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">Review Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Summarize your experience..."
                          {...field}
                          className="transition-all duration-200 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">Rating</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger className="transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/10">
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                              className="hover:bg-primary/10 transition-colors duration-200"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{index + 1}</span>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, starIndex) => (
                                    <AnimatedStar key={starIndex} filled={starIndex <= index} index={starIndex} />
                                  ))}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium">Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your experience with this product..."
                          className="min-h-[120px] resize-none transition-all duration-200 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "relative overflow-hidden group min-w-[120px]",
                    "bg-gradient-to-r from-primary to-primary/90",
                    "hover:from-primary/90 hover:to-primary",
                    "transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReviewForm
