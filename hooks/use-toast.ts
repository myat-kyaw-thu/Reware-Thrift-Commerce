"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

let toastCount = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(({ duration = 5000, ...props }: Omit<Toast, "id">) => {
    const id = (++toastCount).toString()
    const newToast: Toast = { id, duration, ...props }

    setState((prevState) => ({
      toasts: [...prevState.toasts, newToast],
    }))

    if (duration > 0) {
      setTimeout(() => {
        setState((prevState) => ({
          toasts: prevState.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }

    return { id }
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    setState((prevState) => ({
      toasts: toastId ? prevState.toasts.filter((t) => t.id !== toastId) : [],
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  }
}
