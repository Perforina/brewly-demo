"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadLastOrder, type Order } from "@/lib/order";
import { formatPrice } from "@/lib/products";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadLastOrder();
    // Only treat it as an order once both values exist, so the summary never renders half-filled.
    setOrder(saved && saved.orderNumber && Number.isFinite(saved.total) ? saved : null);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <p role="status" aria-busy="true" className="text-muted">
        Loading…
      </p>
    );
  }

  if (!order) {
    return (
      <div className="glass glass-card rise mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-6 text-3xl">No recent order</h1>
        <Link href="/" className="glass pill pill-accent">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="glass glass-card rise mx-auto mt-6 max-w-lg p-8 text-center sm:p-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#C8783A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="mb-4 text-4xl">Order confirmed</h1>
      <p className="mb-6 text-muted">{`Thanks, ${order.name}! A receipt is on its way to ${order.email}.`}</p>
      {/* Label and value in one text node so the line is never read without its value. */}
      <p data-testid="order-number" className="mb-2 rounded-2xl bg-white/[0.05] px-4 py-3 font-semibold">
        {`Order number: ${order.orderNumber}`}
      </p>
      <p data-testid="order-total" className="mb-8 rounded-2xl bg-white/[0.05] px-4 py-3 text-lg font-semibold">
        {`Total: ${formatPrice(order.total)}`}
      </p>
      <Link href="/" className="glass pill pill-accent">
        Continue shopping
      </Link>
    </div>
  );
}
