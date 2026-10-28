/**
 * Mock payment for the Brewly demo. Nothing is charged and no card data
 * leaves the browser. Two published-style test numbers drive the outcome.
 */
export const TEST_CARDS = {
  success: "4242 4242 4242 4242",
  decline: "4000 0000 0000 0002",
} as const;

export type CardFields = { cardNumber: string; expiry: string; cvc: string };
export type CardErrors = Partial<Record<keyof CardFields, string>>;
export type PaymentResult = { ok: true } | { ok: false; reason: "declined" };

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateCard(fields: CardFields): CardErrors {
  const errors: CardErrors = {};
  const number = digitsOnly(fields.cardNumber);
  if (!fields.cardNumber.trim()) errors.cardNumber = "Card number is required";
  else if (number.length !== 16 || /[^\d\s]/.test(fields.cardNumber)) errors.cardNumber = "Enter a 16-digit card number";

  const expiry = fields.expiry.trim();
  if (!expiry) errors.expiry = "Expiry is required";
  else {
    const m = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) errors.expiry = "Use MM/YY";
  }

  const cvc = fields.cvc.trim();
  if (!cvc) errors.cvc = "CVC is required";
  else if (!/^\d{3}$/.test(cvc)) errors.cvc = "Enter the 3-digit CVC";
  return errors;
}

/** Decides the mock charge outcome. Only the decline test card fails. */
export function chargeMock(cardNumber: string): PaymentResult {
  return digitsOnly(cardNumber) === digitsOnly(TEST_CARDS.decline)
    ? { ok: false, reason: "declined" }
    : { ok: true };
}
