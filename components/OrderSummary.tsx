"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export function OrderSummary() {
  const { totals, coupon } = useCart();

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Discount{coupon ? ` (${coupon})` : ""}</dt>
        <dd>{totals.discount > 0 ? `-${formatPrice(totals.discount)}` : formatPrice(0)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Shipping</dt>
        <dd>{totals.shipping === 0 && totals.subtotal > 0 ? "Free" : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-amber-900/10 pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
