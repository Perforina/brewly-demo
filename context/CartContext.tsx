"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { calculateTotals, isValidCoupon, normalizeCoupon, type CartLine, type Totals } from "@/lib/pricing";

const STORAGE_KEY = "brewly-cart";

type StoredCart = { lines: CartLine[]; coupon: string | null };

type CartContextValue = {
  lines: CartLine[];
  coupon: string | null;
  totals: Totals;
  itemCount: number;
  /** False until the cart has been restored from localStorage. */
  hydrated: boolean;
  addItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  /** Applies the code if valid and returns whether it was accepted. */
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredCart;
        if (Array.isArray(stored.lines)) setLines(stored.lines);
        if (stored.coupon && isValidCoupon(stored.coupon)) setCoupon(stored.coupon);
      }
    } catch {
      // Ignore unreadable storage and start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, coupon } satisfies StoredCart));
    } catch {
      // Storage may be unavailable (e.g. private mode); the cart still works in memory.
    }
  }, [lines, coupon, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const setQuantity = (productId: string, quantity: number) => {
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => l.productId !== productId)
          : prev.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
      );
    };

    return {
      lines,
      coupon,
      totals: calculateTotals(lines, coupon),
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      hydrated,
      addItem: (productId) =>
        setLines((prev) =>
          prev.some((l) => l.productId === productId)
            ? prev.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l))
            : [...prev, { productId, quantity: 1 }],
        ),
      setQuantity,
      removeItem: (productId) => setQuantity(productId, 0),
      applyCoupon: (code) => {
        if (!isValidCoupon(code)) return false;
        setCoupon(normalizeCoupon(code));
        return true;
      },
      removeCoupon: () => setCoupon(null),
      clearCart: () => {
        setLines([]);
        setCoupon(null);
      },
    };
  }, [lines, coupon, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
