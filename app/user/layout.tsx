import { auth } from "@/auth";
import { UserNavbar } from "@/components/user/user-navbar";
import type React from "react";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar user={session?.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
