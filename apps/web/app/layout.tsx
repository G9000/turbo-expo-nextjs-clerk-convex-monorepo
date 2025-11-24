import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripy - Trip Budget Tracker",
  description: "Track your trip expenses with multi-currency support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
      >
        <ConvexClientProvider>
          <CurrencyProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 bg-gray-50 dark:bg-zinc-950">
                {children}
              </main>
            </div>
          </CurrencyProvider>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
