"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export function OrderSummary() {
  const { totals, coupon } = useCart();

  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd className="text-right tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Discount{coupon ? ` (${coupon})` : ""}</dt>
        <dd className="text-right tabular-nums">
          {totals.discount > 0 ? `-${formatPrice(totals.discount)}` : formatPrice(0)}
        </dd>
      </div>
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
