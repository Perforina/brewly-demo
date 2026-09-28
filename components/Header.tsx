"use client";

import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-espresso/10 bg-crema/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-espresso">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-copper">
            Shop
          </Link>
          <Link href="/cart" className="rounded-full bg-espresso px-4 py-1.5 text-crema hover:bg-espresso/90">
            Cart ({hydrated ? itemCount : 0})
          </Link>
        </div>
      </nav>
    </header>
  );
}
