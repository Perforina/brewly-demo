import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IntroFlag } from "@/components/IntroFlag";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], weight: "500", variable: "--font-inter-tight", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Brewly",
  description: "Freshly roasted coffee, delivered.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <IntroFlag />
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
