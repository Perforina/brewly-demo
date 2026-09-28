"use client";

import { useState, type CSSProperties } from "react";
import { CoffeeBag } from "@/components/CoffeeBag";
import { Laurel } from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { getProductStyle } from "@/lib/productStyles";
import { formatPrice, PRODUCTS } from "@/lib/products";

/** Stagger index for the one-time `.rise` entrance. */
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HomePage() {
  const { addItem } = useCart();
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section className="hero rise flex items-center justify-center px-6 py-16 text-center" style={stagger(0)}>
        <div className="steam top-[8%] left-[4%] h-64 w-72 bg-[rgba(200,110,40,0.45)]" aria-hidden="true" />
        <div className="steam top-[18%] right-[6%] h-56 w-64 bg-[rgba(160,70,20,0.4)] [animation-delay:-7s]" aria-hidden="true" />
        <div className="steam bottom-[10%] left-[34%] h-60 w-80 bg-[rgba(230,150,80,0.22)] [animation-delay:-13s]" aria-hidden="true" />

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 sm:gap-5">
            <Laurel />
            <h1 className="text-6xl tracking-tight sm:text-7xl">Brewly</h1>
            <Laurel flip />
          </div>
          <p className="mt-4 text-lg text-muted sm:text-xl">Small-batch coffee, roasted this week</p>
          <p className="glass pill mt-8 text-sm font-medium sm:text-base">Free shipping on orders $50+ after discounts</p>
        </div>
      </section>

      <ul className="rise grid gap-4 sm:grid-cols-3" style={stagger(1)}>
        <li className="glass glass-card flex flex-col items-center gap-1 px-5 py-6 text-center">
          <p className="font-display text-4xl leading-none">6</p>
          <p className="text-sm text-muted">single origins</p>
        </li>
        <li className="glass glass-card flex flex-col items-center gap-1 px-5 py-6 text-center">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#C8783A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-7.5Z" />
            <path d="M6 20h12" />
          </svg>
          <p className="text-sm text-muted">Roasted weekly</p>
        </li>
        <li className="glass glass-card flex flex-col items-center gap-1 px-5 py-6 text-center">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="#C8783A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
            <circle cx="7" cy="18" r="1.8" />
            <circle cx="17" cy="18" r="1.8" />
          </svg>
          <p className="text-sm text-muted">Ships in 24h</p>
        </li>
      </ul>

      <section className="rise" style={stagger(2)}>
        <h2 className="mb-5 text-3xl">Our coffee</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li key={product.id} className="glass glass-card flex flex-col p-5">
              <div className="mb-5 flex justify-center rounded-[18px] bg-white/[0.03] py-6">
                <CoffeeBag productId={product.id} label={product.name} className="w-32 sm:w-36" />
              </div>
              <h3 className="text-xl">{product.name}</h3>
              <p className="mt-1 text-sm text-muted">{getProductStyle(product.id).tastingNote}</p>
              <p className="mt-3 mb-5 text-lg font-semibold tabular-nums">{formatPrice(product.price)}</p>
              <button
                type="button"
                onClick={() => {
                  addItem(product.id);
                  setLastAdded(product.id);
                }}
                className="glass pill pill-accent mt-auto w-full text-[15px]"
              >
                {`Add ${product.name} to cart`}
              </button>
              {lastAdded === product.id && (
                <p role="status" className="mt-2 text-center text-sm text-muted">
                  Added to cart
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
