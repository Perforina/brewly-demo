"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CoffeeBag } from "@/components/CoffeeBag";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { INVALID_COUPON_MESSAGE } from "@/lib/pricing";
import { formatPrice, getProduct } from "@/lib/products";

export default function CartPage() {
  const { lines, coupon, totals, hydrated, setQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <p role="status" aria-busy="true" className="text-muted">
        Loading cart…
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="glass glass-card rise mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-4 text-3xl">Your cart</h1>
        <p className="mb-6 text-muted">Your cart is empty.</p>
        <Link href="/" className="glass pill pill-accent">
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
    <div className="rise">
      <h1 className="mb-6 text-3xl sm:text-4xl">Your cart</h1>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <ul className="h-fit space-y-3">
          {lines.map((line) => {
            const product = getProduct(line.productId);
            if (!product) return null;
            return (
              <li key={line.productId} className="glass glass-card flex flex-wrap items-center gap-4 p-4">
                {/* Thumbnail omits the label name: product names stay on their own card. */}
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <CoffeeBag productId={product.id} className="w-11" />
                </div>
                <div className="min-w-32 flex-1">
                  <p className="font-display text-lg">{product.name}</p>
                  <p className="text-sm text-muted tabular-nums">{`${formatPrice(product.price)} each`}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="glass chip"
                  >
                    Decrease
                  </button>
                  <span className="w-16 text-center text-sm font-medium tabular-nums" aria-live="polite">
                    {`Qty: ${line.quantity}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="glass chip"
                  >
                    Increase
                  </button>
                </div>
                <div className="ml-auto flex items-baseline gap-3 whitespace-nowrap">
                  <p className="font-semibold tabular-nums">{formatPrice(product.price * line.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    aria-label={`Remove ${product.name}`}
                    className="text-xs text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="glass glass-card h-fit space-y-6 p-5 sm:p-6">
          <form onSubmit={handleApply} noValidate>
            <label htmlFor="coupon" className="mb-2 block text-sm font-medium text-muted">
              Coupon code
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-invalid={!!couponError}
                aria-describedby={couponError ? "coupon-error" : undefined}
                className="glass-input"
              />
              <button type="submit" className="glass pill pill-accent w-full">
                Apply coupon
              </button>
            </div>
            {couponError && (
              <p id="coupon-error" role="alert" className="mt-2 text-sm font-medium text-danger">
                {couponError}
              </p>
            )}
            {coupon && (
              <p className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-accent/15 px-3.5 py-2.5 text-[13px] whitespace-nowrap sm:text-sm">
                <span className="font-medium">{`Coupon ${coupon} applied`}</span>
                <button type="button" onClick={removeCoupon} className="font-medium text-danger underline underline-offset-4">
                  Remove coupon
                </button>
              </p>
            )}
          </form>

          <OrderSummary />

          {totals.discounts.total > 0 && (
            <p className="rounded-2xl bg-accent/15 px-3.5 py-2.5 text-center text-sm font-semibold tabular-nums">
              {`You saved ${formatPrice(totals.discounts.total)}`}
            </p>
          )}

          <Link href="/checkout" className="glass pill pill-accent w-full">
            Go to payment
          </Link>
        </aside>
      </div>
    </div>
  );
}
