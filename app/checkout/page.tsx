"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { generateOrderNumber, saveLastOrder } from "@/lib/order";
import { isValidEmail } from "@/lib/validation";
import { TEST_CARDS, chargeMock, validateCard } from "@/lib/payment";

type Fields = {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!fields.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(fields.email)) errors.email = "Enter a valid email address";
  if (!fields.address.trim()) errors.address = "Address is required";
  return { ...errors, ...validateCard(fields) };
}

const inputClass = "glass-input";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totals, hydrated, clearCart } = useCart();
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
    if (field === "cardNumber" || field === "expiry" || field === "cvc") setPaymentError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPaymentError(null);
    setPlacing(true);
    // Short pause so the mock charge reads like a real payment step.
    window.setTimeout(() => {
      const result = chargeMock(fields.cardNumber);
      if (!result.ok) {
        setPlacing(false);
        setPaymentError("Payment declined. Your card was not charged and your cart is saved. Try a different card.");
        return;
      }
      saveLastOrder({
        orderNumber: generateOrderNumber(),
        total: totals.total,
        name: fields.name.trim(),
        email: fields.email.trim(),
      });
      clearCart();
      router.push("/confirmation");
    }, 800);
  }

  const cardInputs = [
    { id: "cardNumber", label: "Card number", autoComplete: "cc-number", placeholder: "1234 5678 9012 3456" },
    { id: "expiry", label: "Expiry (MM/YY)", autoComplete: "cc-exp", placeholder: "MM/YY" },
    { id: "cvc", label: "CVC", autoComplete: "cc-csc", placeholder: "123" },
  ] as const;

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
          <fieldset className="space-y-4 border-t border-white/10 pt-5">
            <legend className="mb-2 text-lg font-semibold">Payment</legend>
            <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-muted">
              {`Test mode, no real payments. Pay with ${TEST_CARDS.success}. Simulate a decline with ${TEST_CARDS.decline}. Any expiry and any 3-digit CVC.`}
            </p>
            {cardInputs.map(({ id, label, autoComplete, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-2 block text-sm font-medium text-muted">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type="text"
                  inputMode="numeric"
                  autoComplete={autoComplete}
                  placeholder={placeholder}
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
          </fieldset>
          {paymentError && (
            <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-danger">
              {paymentError}
            </p>
          )}
          <button
            type="submit"
            disabled={placing}
            className="glass pill pill-accent w-full"
          >
            {placing ? "Processing payment…" : "Place order"}
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
