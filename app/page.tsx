"use client";

import { useState } from "react";
import { BeanMark } from "@/components/Logo";
import { CoffeeBag } from "@/components/CoffeeBag";
import { useCart } from "@/context/CartContext";
import { getProductStyle } from "@/lib/productStyles";
import { formatPrice, PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const { addItem } = useCart();
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  return (
    <div>
      <section className="relative mb-12 overflow-hidden rounded-3xl bg-[#EFE3D3] px-6 py-12 sm:px-12 sm:py-16">
        <BeanMark className="absolute -top-6 -right-6 h-40 w-40 opacity-10" />
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-espresso/70 uppercase">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-sage align-middle" aria-hidden="true" />
          Specialty roaster
        </p>
        <h1 className="max-w-xl text-4xl leading-tight font-semibold sm:text-5xl">Small-batch coffee, roasted this week</h1>
        <p className="mt-4 max-w-lg text-lg text-espresso/80">
          Single origins and blends, roasted to order and shipped fresh to your door.
        </p>
      </section>

      <h2 className="mb-6 text-3xl font-semibold">Our coffee</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <li
            key={product.id}
            className="card flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(59,36,24,0.12)] motion-reduce:transform-none"
          >
            <div className="mb-5 flex justify-center rounded-xl bg-crema py-6">
              <CoffeeBag productId={product.id} label={product.name} className="w-32 sm:w-36" />
            </div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-espresso/70 italic">{getProductStyle(product.id).tastingNote}</p>
            <p className="mt-3 mb-5 text-lg font-semibold">{formatPrice(product.price)}</p>
            <button
              type="button"
              onClick={() => {
                addItem(product.id);
                setLastAdded(product.id);
              }}
              className="btn-primary mt-auto w-full"
            >
              Add {product.name} to cart
            </button>
            {lastAdded === product.id && (
              <p role="status" className="mt-2 text-sm font-medium text-espresso">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
                Added to cart
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
