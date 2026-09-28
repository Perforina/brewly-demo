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

const inputClass = "w-full rounded border border-amber-900/30 px-3 py-2";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totals, hydrated, clearCart } = useCart();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  if (!hydrated) return <p>Loading…</p>;

  if (lines.length === 0 && !placing) {
    return (
      <div>
        <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/" className="font-medium text-amber-900 underline">
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
    <div>
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-amber-900/10 bg-white p-5">
          {(
            [
              { id: "name", label: "Full name", type: "text", autoComplete: "name" },
              { id: "email", label: "Email", type: "email", autoComplete: "email" },
            ] as const
          ).map(({ id, label, type, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1 block text-sm font-medium">
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
                <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
                  {errors[id]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium">
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
              <p id="address-error" className="mt-1 text-sm text-red-700">
                {errors.address}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full rounded bg-amber-900 px-4 py-3 font-medium text-white hover:bg-amber-800 disabled:opacity-60"
          >
            Place order
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-amber-900/10 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <OrderSummary />
          <Link href="/cart" className="mt-4 block text-sm text-amber-900 underline">
            Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
