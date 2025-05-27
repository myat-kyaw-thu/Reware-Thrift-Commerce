"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithCredentials } from "@/lib/actions/user.action"
import { signInDefaultValues } from "@/lib/constants"
import { ArrowRight, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const SignInButton = () => {
    const { pending } = useFormStatus()

    return (
      <Button
        disabled={pending}
        className="w-full h-12 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-medium rounded-xl shadow-lg shadow-gray-800/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-800/30 hover:-translate-y-0.5 group"
      >
        <span className="flex items-center justify-center gap-2">
          {pending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </Button>
    )
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
            className="h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue={signInDefaultValues.password}
            className="h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="pt-2">
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className="p-3 rounded-lg bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-center">
          <p className="text-sm text-red-600 font-medium">{data.message}</p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200/50">
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            target="_self"
            className="font-medium text-gray-800 hover:text-gray-600 transition-colors duration-200 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
          >
            Create one here
          </Link>
        </p>
      </div>
    </form>
  )
}

export default CredentialsSignInForm
