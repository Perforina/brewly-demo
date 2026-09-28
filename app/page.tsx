"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const { addItem } = useCart();
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Our coffee</h1>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="flex flex-col rounded-lg border border-amber-900/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-32 items-center justify-center rounded bg-amber-100 text-4xl" aria-hidden="true">
              ☕
            </div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mb-4 text-amber-900">{formatPrice(product.price)}</p>
            <button
              type="button"
              onClick={() => {
                addItem(product.id);
                setLastAdded(product.id);
              }}
              className="mt-auto rounded bg-amber-900 px-4 py-2 font-medium text-white hover:bg-amber-800"
            >
              Add {product.name} to cart
            </button>
            {lastAdded === product.id && (
              <p role="status" className="mt-2 text-sm text-green-700">
                Added to cart
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
