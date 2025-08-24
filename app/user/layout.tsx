import Menu from "@/components/shared/header/menu";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import MainNav from "../user/main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <Image
                    src="/images/logo.png"
                    height={40}
                    width={40}
                    alt={APP_NAME}
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 dark:from-slate-100 dark:via-gray-200 dark:to-zinc-100 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                </div>
                <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 dark:from-slate-100 dark:via-gray-200 dark:to-zinc-100 bg-clip-text text-transparent">
                  {APP_NAME}
                </span>
              </Link>

              <div className="hidden md:block">
                <MainNav className="ml-6" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="md:hidden">
                <MainNav />
              </div>
              <Menu />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
