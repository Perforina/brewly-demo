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
      <div>
        <h1 className="mb-4 text-3xl font-bold">No recent order</h1>
        <Link href="/" className="font-medium text-amber-900 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-amber-900/10 bg-white p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold text-green-800">Order confirmed</h1>
      <p className="mb-2">Thanks, {order.name}! A receipt is on its way to {order.email}.</p>
      <p className="mb-2">
        Order number: <strong>{order.orderNumber}</strong>
      </p>
      <p className="mb-6">
        Total: <strong>{formatPrice(order.total)}</strong>
      </p>
      <Link href="/" className="inline-block rounded bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800">
        Continue shopping
      </Link>
    </div>
  );
}
