"use client";

import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount, hydrated } = useCart();

  return (
    <header className="glass sticky top-0 z-20">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="rounded-full">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link href="/" className="chip">
            Shop
          </Link>
          <Link href="/cart" className="glass chip">
            Cart ({hydrated ? itemCount : 0})
          </Link>
        </div>
      </nav>
    </header>
  );
}
