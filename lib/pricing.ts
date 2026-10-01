import { getProduct } from "./products";

// All amounts are integer cents to avoid floating-point rounding errors.

export type CartLine = { productId: string; quantity: number };

export type Discounts = {
  bundle: number;
  coupon: number;
  /** Sum of every discount applied to the order. */
  total: number;
};

export type Totals = {
  subtotal: number;
  discounts: Discounts;
  shipping: number;
  total: number;
};

export const COUPON_CODE = "SAVE10";
export const COUPON_RATE = 0.1;
export const BUNDLE_MIN_BAGS = 4;
export const BUNDLE_RATE = 0.15;
export const SHIPPING_FEE = 500;
export const FREE_SHIPPING_THRESHOLD = 5000;
export const INVALID_COUPON_MESSAGE = "Code not valid";

function countedLines(lines: CartLine[]) {
  return lines.flatMap((line) => {
    const product = getProduct(line.productId);
    return product && line.quantity > 0 ? [{ product, quantity: line.quantity }] : [];
  });
}

export function calculateSubtotal(lines: CartLine[]): number {
  return countedLines(lines).reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
}

export function countBags(lines: CartLine[]): number {
  return countedLines(lines).reduce((n, { quantity }) => n + quantity, 0);
}

export function normalizeCoupon(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidCoupon(code: string): boolean {
  return normalizeCoupon(code) === COUPON_CODE;
}

// Every discount is computed here. Each rate applies to the original subtotal,
// so the bundle discount and SAVE10 stack additively (15% + 10% = 25% off).
// - Bundle: 4 or more bags takes 15% off the subtotal.
// - PRD rule 3: SAVE10 takes 10% off the subtotal.
export function applyDiscounts(lines: CartLine[], coupon: string | null): Discounts {
  const subtotal = calculateSubtotal(lines);
  const bundle = countBags(lines) >= BUNDLE_MIN_BAGS ? Math.round(subtotal * BUNDLE_RATE) : 0;
  const couponDiscount = coupon && isValidCoupon(coupon) ? Math.round(subtotal * COUPON_RATE) : 0;
  return { bundle, coupon: couponDiscount, total: bundle + couponDiscount };
}

// PRD rule 4: $5 shipping, free when the subtotal AFTER discounts is $50 or more.
// An empty cart has nothing to ship, so it is charged nothing.
export function calculateShipping(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0;
  return subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculateTotals(lines: CartLine[], coupon: string | null): Totals {
  const subtotal = calculateSubtotal(lines);
  const discounts = applyDiscounts(lines, coupon);
  const shipping = calculateShipping(subtotal - discounts.total);
  return { subtotal, discounts, shipping, total: subtotal - discounts.total + shipping };
}
