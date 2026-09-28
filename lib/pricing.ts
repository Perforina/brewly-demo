import { getProduct } from "./products";

// All amounts are integer cents to avoid floating-point rounding errors.

export type CartLine = { productId: string; quantity: number };

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export const COUPON_CODE = "SAVE10";
export const COUPON_RATE = 0.1;
export const SHIPPING_FEE = 500;
export const FREE_SHIPPING_THRESHOLD = 5000;
export const INVALID_COUPON_MESSAGE = "Code not valid";

export function calculateSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const product = getProduct(line.productId);
    if (!product || line.quantity <= 0) return sum;
    return sum + product.price * line.quantity;
  }, 0);
}

export function normalizeCoupon(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidCoupon(code: string): boolean {
  return normalizeCoupon(code) === COUPON_CODE;
}

// PRD rule 3: SAVE10 takes 10% off the subtotal.
export function calculateDiscount(subtotal: number, coupon: string | null): number {
  if (!coupon || !isValidCoupon(coupon)) return 0;
  return Math.round(subtotal * COUPON_RATE);
}

// PRD rule 4: $5 shipping, free when the subtotal AFTER discounts is $50 or more.
// An empty cart has nothing to ship, so it is charged nothing.
export function calculateShipping(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0;
  return subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculateTotals(lines: CartLine[], coupon: string | null): Totals {
  const subtotal = calculateSubtotal(lines);
  const discount = calculateDiscount(subtotal, coupon);
  const shipping = calculateShipping(subtotal - discount);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
