"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { generateOrderNumber, saveLastOrder } from "@/lib/order";
import { isValidEmail } from "@/lib/validation";

type Fields = { name: string; email: string; address: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!fields.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(fields.email)) errors.email = "Enter a valid email address";
  if (!fields.address.trim()) errors.address = "Address is required";
  return errors;
}

const inputClass = "glass-input";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totals, hydrated, clearCart } = useCart();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  if (!hydrated) {
    return (
      <p role="status" aria-busy="true" className="text-muted">
        Loading…
      </p>
    );
  }

  if (lines.length === 0 && !placing) {
    return (
      <div className="glass glass-card rise mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-4 text-3xl">Checkout</h1>
        <p className="mb-6 text-muted">Your cart is empty.</p>
        <Link href="/" className="glass pill pill-accent">
          Continue shopping
        </Link>
      </div>
    );
  }

  function update(field: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPlacing(true);
    saveLastOrder({
      orderNumber: generateOrderNumber(),
      total: totals.total,
      name: fields.name.trim(),
      email: fields.email.trim(),
    });
    clearCart();
    router.push("/confirmation");
  }

  return (
    <div className="rise">
      <h1 className="mb-6 text-3xl sm:text-4xl">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="glass glass-card space-y-5 p-5 sm:p-6">
          {(
            [
              { id: "name", label: "Full name", type: "text", autoComplete: "name" },
              { id: "email", label: "Email", type: "email", autoComplete: "email" },
            ] as const
          ).map(({ id, label, type, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-2 block text-sm font-medium text-muted">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                autoComplete={autoComplete}
                required
                value={fields[id]}
                onChange={(e) => update(id, e.target.value)}
                aria-invalid={!!errors[id]}
                aria-describedby={errors[id] ? `${id}-error` : undefined}
                className={inputClass}
              />
              {errors[id] && (
                <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
                  {errors[id]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium text-muted">
              Shipping address
            </label>
            <textarea
              id="address"
              name="address"
              autoComplete="street-address"
              rows={3}
              required
              value={fields.address}
              onChange={(e) => update("address", e.target.value)}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
              className={inputClass}
            />
            {errors.address && (
              <p id="address-error" className="mt-1.5 text-sm font-medium text-danger">
                {errors.address}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={placing}
            className="glass pill pill-accent w-full"
          >
            Place order
          </button>
        </form>

        <aside className="glass glass-card h-fit p-5 sm:p-6">
          <h2 className="mb-4 text-xl">Order summary</h2>
          <OrderSummary />
          <Link href="/cart" className="text-link mt-5 inline-block text-sm">
            Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
