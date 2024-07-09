import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { Navbar } from "~/components/navbar";
import { Toaster } from "~/components/ui/toaster";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import { fileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
  title: "Social Network",
  description: "Example social network app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen w-full flex-col gap-3 bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
          <Navbar />
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
