"use client";

import { useCart } from "@/context/CartContext";
import { BUNDLE_MIN_BAGS } from "@/lib/pricing";
import { formatPrice } from "@/lib/products";

export function OrderSummary() {
  const { totals, coupon, hydrated } = useCart();

  // Never show totals computed from the empty pre-hydration cart.
  if (!hydrated) return null;

  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd className="text-right tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discounts.bundle > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{`Bundle discount (${BUNDLE_MIN_BAGS}+ bags)`}</dt>
          <dd className="text-right tabular-nums">{`-${formatPrice(totals.discounts.bundle)}`}</dd>
        </div>
      )}
      {/* The generic $0.00 row is only useful when no other discount row is showing. */}
      {(coupon || totals.discounts.bundle === 0) && (
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{coupon ? `Discount (${coupon})` : "Discount"}</dt>
          <dd className="text-right tabular-nums">
            {totals.discounts.coupon > 0 ? `-${formatPrice(totals.discounts.coupon)}` : formatPrice(0)}
          </dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Shipping</dt>
        <dd className="text-right tabular-nums">
          {totals.shipping === 0 && totals.subtotal > 0 ? "Free" : formatPrice(totals.shipping)}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-lg font-semibold">
        <dt>Total</dt>
        <dd className="text-right text-xl tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
