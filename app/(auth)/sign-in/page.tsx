import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CredentialsSignInForm from "./credentials-signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <Card className="backdrop-blur-xl bg-white/70 border-gray-200/50 shadow-2xl shadow-gray-200/20">
          <CardHeader className="space-y-6 pb-8">
            <Link href="/" className="flex justify-center">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-gray-200/30 border border-gray-200/50">
                <Image
                  src="/images/logo.png"
                  width={60}
                  height={60}
                  alt={`${APP_NAME} logo`}
                  priority={true}
                  className="transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-800 tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-gray-600 text-base">Sign in to continue to your account</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <CredentialsSignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
