"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { INVALID_COUPON_MESSAGE } from "@/lib/pricing";
import { formatPrice, getProduct } from "@/lib/products";

export default function CartPage() {
  const { lines, coupon, hydrated, setQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!hydrated) return <p>Loading cart…</p>;

  if (lines.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Your cart</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/" className="font-medium text-amber-900 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  function handleApply(e: FormEvent) {
    e.preventDefault();
    if (applyCoupon(code)) {
      setCouponError(null);
      setCode("");
    } else {
      setCouponError(INVALID_COUPON_MESSAGE);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Your cart</h1>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <ul className="divide-y divide-amber-900/10 rounded-lg border border-amber-900/10 bg-white">
          {lines.map((line) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            return (
              <li key={line.productId} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-40 flex-1">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-amber-900">{formatPrice(product.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="rounded border border-amber-900/30 px-3 py-1 text-sm hover:bg-amber-50"
                  >
                    Decrease
                  </button>
                  <span className="w-16 text-center text-sm" aria-live="polite">
                    Qty: {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="rounded border border-amber-900/30 px-3 py-1 text-sm hover:bg-amber-50"
                  >
                    Increase
                  </button>
                </div>
                <p className="w-20 text-right font-medium">{formatPrice(product.price * line.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(line.productId)}
                  aria-label={`Remove ${product.name}`}
                  className="text-sm text-red-700 underline"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="space-y-6 rounded-lg border border-amber-900/10 bg-white p-5">
          <form onSubmit={handleApply} noValidate>
            <label htmlFor="coupon" className="mb-1 block text-sm font-medium">
              Coupon code
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-describedby={couponError ? "coupon-error" : undefined}
                className="w-full rounded border border-amber-900/30 px-3 py-2"
              />
              <button type="submit" className="rounded bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800">
                Apply coupon
              </button>
            </div>
            {couponError && (
              <p id="coupon-error" role="alert" className="mt-2 text-sm text-red-700">
                {couponError}
              </p>
            )}
            {coupon && (
              <p className="mt-2 flex items-center justify-between text-sm text-green-700">
                <span>Coupon {coupon} applied</span>
                <button type="button" onClick={removeCoupon} className="text-red-700 underline">
                  Remove coupon
                </button>
              </p>
            )}
          </form>

          <OrderSummary />

          <Link
            href="/checkout"
            className="block rounded bg-amber-900 px-4 py-3 text-center font-medium text-white hover:bg-amber-800"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
