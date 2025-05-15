import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME } from "../lib/constants";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter}`}
      >
        {children}
      </body>
    </html>
  );
}
