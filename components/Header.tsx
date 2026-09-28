"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount, hydrated } = useCart();

  return (
    <header className="border-b border-amber-900/10 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-amber-900">
          Brewly
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Shop
          </Link>
          <Link href="/cart" className="hover:underline">
            Cart ({hydrated ? itemCount : 0})
          </Link>
        </div>
      </nav>
    </header>
  );
}
