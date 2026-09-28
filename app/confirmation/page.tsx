"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadLastOrder, type Order } from "@/lib/order";
import { formatPrice } from "@/lib/products";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(loadLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading…</p>;

  if (!order) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-6 text-3xl font-semibold">No recent order</h1>
        <Link href="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-lg p-8 text-center sm:p-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sage/20" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#3B2418" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="mb-4 text-4xl font-semibold">Order confirmed</h1>
      <p className="mb-6 text-espresso/80">Thanks, {order.name}! A receipt is on its way to {order.email}.</p>
      <p className="mb-2 rounded-xl bg-crema px-4 py-3">
        Order number: <strong>{order.orderNumber}</strong>
      </p>
      <p className="mb-8 rounded-xl bg-crema px-4 py-3">
        Total: <strong>{formatPrice(order.total)}</strong>
      </p>
      <Link href="/" className="btn-primary">
        Continue shopping
      </Link>
    </div>
  );
}
