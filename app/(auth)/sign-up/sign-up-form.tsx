"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.action";
import { signUpDefaultValues } from "@/lib/constants";
import { ArrowRight, Lock, Mail, Shield, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const SignUpButton = () => {
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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </Button>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
            className="h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Enter your full name"
          />
        </div>

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
            defaultValue={signUpDefaultValues.email}
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
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
            className="h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Create a password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.confirmPassword}
            className="h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 rounded-xl focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <div className="pt-2">
        <SignUpButton />
      </div>

      {data && !data.success && (
        <div className="p-3 rounded-lg bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-center">
          <p className="text-sm text-red-600 font-medium">{data.message}</p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200/50">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            target="_self"
            className="font-medium text-gray-800 hover:text-gray-600 transition-colors duration-200 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
}

export default SignUpForm
