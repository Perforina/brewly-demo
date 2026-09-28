"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CoffeeBag } from "@/components/CoffeeBag";
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
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Your cart</h1>
        <p className="mb-6 text-espresso/80">Your cart is empty.</p>
        <Link href="/" className="btn-primary">
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
      <h1 className="mb-6 text-3xl font-semibold sm:text-4xl">Your cart</h1>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <ul className="card h-fit divide-y divide-espresso/10">
          {lines.map((line) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            return (
              <li key={line.productId} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                {/* Thumbnail omits the label name: product names stay on their own card. */}
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-crema">
                  <CoffeeBag productId={product.id} className="w-11" />
                </div>
                <div className="min-w-32 flex-1">
                  <p className="font-display text-lg font-semibold">{product.name}</p>
                  <p className="text-sm text-espresso/70">{formatPrice(product.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="btn-secondary"
                  >
                    Decrease
                  </button>
                  <span className="w-16 text-center text-sm font-medium" aria-live="polite">
                    Qty: {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="btn-secondary"
                  >
                    Increase
                  </button>
                </div>
                <p className="w-20 text-right font-semibold">{formatPrice(product.price * line.quantity)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(line.productId)}
                  aria-label={`Remove ${product.name}`}
                  className="text-sm font-medium text-red-700 underline underline-offset-4"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="card h-fit space-y-6 p-5 sm:p-6">
          <form onSubmit={handleApply} noValidate>
            <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium">
              Coupon code
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-describedby={couponError ? "coupon-error" : undefined}
                className="field min-w-0 flex-1"
              />
              <button type="submit" className="btn-primary">
                Apply coupon
              </button>
            </div>
            {couponError && (
              <p id="coupon-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
                {couponError}
              </p>
            )}
            {coupon && (
              <p className="mt-3 flex items-center justify-between rounded-xl bg-sage/15 px-3 py-2 text-sm">
                <span className="font-medium">Coupon {coupon} applied</span>
                <button type="button" onClick={removeCoupon} className="font-medium text-red-700 underline underline-offset-4">
                  Remove coupon
                </button>
              </p>
            )}
          </form>

          <OrderSummary />

          <Link href="/checkout" className="btn-primary w-full py-3">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
