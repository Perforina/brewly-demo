import { describe, expect, it } from "vitest";
import {
  applyDiscounts,
  calculateShipping,
  calculateSubtotal,
  calculateTotals,
  countBags,
  INVALID_COUPON_MESSAGE,
  isValidCoupon,
  type CartLine,
} from "./pricing";
import { PRODUCTS } from "./products";

describe("Rule 1: catalog", () => {
  it("has exactly the 6 coffee bags at the PRD prices", () => {
    expect(PRODUCTS.map((p) => [p.name, p.price])).toEqual([
      ["House Blend", 1200],
      ["Ethiopia Yirgacheffe", 1800],
      ["Colombia Supremo", 1600],
      ["Kenya AA", 2000],
      ["Decaf Swiss Water", 1500],
      ["Espresso Roast", 1400],
    ]);
  });
});

describe("Rule 2: subtotal of line items", () => {
  it("is 0 for an empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("sums price x quantity across line items", () => {
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 2 }, // $24
      { productId: "kenya-aa", quantity: 1 }, // $20
    ];
    expect(calculateSubtotal(lines)).toBe(4400);
  });

  it("ignores unknown products and non-positive quantities", () => {
    const lines: CartLine[] = [
      { productId: "unknown", quantity: 3 },
      { productId: "espresso-roast", quantity: 0 },
      { productId: "decaf-swiss-water", quantity: 1 },
    ];
    expect(calculateSubtotal(lines)).toBe(1500);
  });
});

describe("Rule 3: SAVE10 coupon", () => {
  it("accepts SAVE10 (case-insensitive, trimmed)", () => {
    expect(isValidCoupon("SAVE10")).toBe(true);
    expect(isValidCoupon(" save10 ")).toBe(true);
  });

  it("rejects other codes", () => {
    expect(isValidCoupon("SAVE20")).toBe(false);
    expect(isValidCoupon("")).toBe(false);
  });

  it("takes 10% off the subtotal", () => {
    // House Blend x2 + Kenya AA x1 = $44
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 2 },
      { productId: "kenya-aa", quantity: 1 },
    ];
    expect(applyDiscounts(lines, "SAVE10")).toEqual({ bundle: 0, coupon: 440, total: 440 });
    expect(applyDiscounts([{ productId: "house-blend", quantity: 1 }], "SAVE10").coupon).toBe(120);
  });

  it("gives no discount without a coupon or with an invalid one", () => {
    const lines: CartLine[] = [{ productId: "kenya-aa", quantity: 2 }];
    expect(applyDiscounts(lines, null)).toEqual({ bundle: 0, coupon: 0, total: 0 });
    expect(applyDiscounts(lines, "BOGUS")).toEqual({ bundle: 0, coupon: 0, total: 0 });
  });

  it("uses the exact invalid-code message", () => {
    expect(INVALID_COUPON_MESSAGE).toBe("Code not valid");
  });
});

describe("Bundle discount: 4+ bags", () => {
  it("counts bags across line items, ignoring unknown products and non-positive quantities", () => {
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 2 },
      { productId: "kenya-aa", quantity: 1 },
      { productId: "unknown", quantity: 5 },
      { productId: "espresso-roast", quantity: 0 },
    ];
    expect(countBags(lines)).toBe(3);
  });

  it("does not apply to 3 bags", () => {
    const lines: CartLine[] = [{ productId: "house-blend", quantity: 3 }];
    expect(applyDiscounts(lines, null)).toEqual({ bundle: 0, coupon: 0, total: 0 });
  });

  it("takes 15% off the subtotal at exactly 4 bags", () => {
    // House Blend x4 = $48 → $7.20 off
    const lines: CartLine[] = [{ productId: "house-blend", quantity: 4 }];
    expect(applyDiscounts(lines, null)).toEqual({ bundle: 720, coupon: 0, total: 720 });
  });

  it("counts bags of different products together", () => {
    // House Blend x2 + Kenya AA x2 = $64 → $9.60 off
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 2 },
      { productId: "kenya-aa", quantity: 2 },
    ];
    expect(applyDiscounts(lines, null)).toEqual({ bundle: 960, coupon: 0, total: 960 });
  });

  it("does not count unknown products toward the 4 bags", () => {
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 1 },
      { productId: "unknown", quantity: 3 },
    ];
    expect(applyDiscounts(lines, null).bundle).toBe(0);
  });

  it("stacks with SAVE10, each taken off the original subtotal", () => {
    // House Blend x4 = $48 → 15% ($7.20) + 10% ($4.80) = $12 off
    const lines: CartLine[] = [{ productId: "house-blend", quantity: 4 }];
    expect(applyDiscounts(lines, "save10")).toEqual({ bundle: 720, coupon: 480, total: 1200 });
  });

  it("feeds the combined discount into shipping and the total", () => {
    // House Blend x2 + Kenya AA x2 = $64
    const lines: CartLine[] = [
      { productId: "house-blend", quantity: 2 },
      { productId: "kenya-aa", quantity: 2 },
    ];
    // Bundle only: $64 - $9.60 = $54.40 → free shipping
    expect(calculateTotals(lines, null)).toEqual({
      subtotal: 6400,
      discounts: { bundle: 960, coupon: 0, total: 960 },
      shipping: 0,
      total: 5440,
    });
    // Bundle + SAVE10: $64 - $16 = $48 → $5 shipping
    expect(calculateTotals(lines, "SAVE10")).toEqual({
      subtotal: 6400,
      discounts: { bundle: 960, coupon: 640, total: 1600 },
      shipping: 500,
      total: 5300,
    });
  });
});

describe("Rule 4: shipping", () => {
  it("is $5 below $50", () => {
    expect(calculateShipping(4999)).toBe(500);
    expect(calculateShipping(1200)).toBe(500);
  });

  it("is free at exactly $50 and above", () => {
    expect(calculateShipping(5000)).toBe(0);
    expect(calculateShipping(8000)).toBe(0);
  });

  it("uses the subtotal AFTER discount: $50 subtotal with SAVE10 pays shipping", () => {
    // Kenya AA x2 + House Blend x1 = $52 → $46.80 after discount → $5 shipping
    const lines: CartLine[] = [
      { productId: "kenya-aa", quantity: 2 },
      { productId: "house-blend", quantity: 1 },
    ];
    expect(calculateTotals(lines, null)).toEqual({
      subtotal: 5200,
      discounts: { bundle: 0, coupon: 0, total: 0 },
      shipping: 0,
      total: 5200,
    });
    expect(calculateTotals(lines, "SAVE10")).toEqual({
      subtotal: 5200,
      discounts: { bundle: 0, coupon: 520, total: 520 },
      shipping: 500,
      total: 5180,
    });
  });

  it("is free when the discounted subtotal still reaches $50", () => {
    // Kenya AA x2 + Colombia Supremo x1 = $56 → $50.40 after discount → free shipping
    const lines: CartLine[] = [
      { productId: "kenya-aa", quantity: 2 },
      { productId: "colombia-supremo", quantity: 1 },
    ];
    expect(calculateTotals(lines, "SAVE10")).toEqual({
      subtotal: 5600,
      discounts: { bundle: 0, coupon: 560, total: 560 },
      shipping: 0,
      total: 5040,
    });
  });

  it("charges nothing for an empty cart", () => {
    expect(calculateTotals([], "SAVE10")).toEqual({
      subtotal: 0,
      discounts: { bundle: 0, coupon: 0, total: 0 },
      shipping: 0,
      total: 0,
    });
  });
});

describe("Total", () => {
  it("is subtotal - discount + shipping", () => {
    const lines: CartLine[] = [{ productId: "ethiopia-yirgacheffe", quantity: 1 }];
    expect(calculateTotals(lines, null)).toEqual({
      subtotal: 1800,
      discounts: { bundle: 0, coupon: 0, total: 0 },
      shipping: 500,
      total: 2300,
    });
    expect(calculateTotals(lines, "SAVE10")).toEqual({
      subtotal: 1800,
      discounts: { bundle: 0, coupon: 180, total: 180 },
      shipping: 500,
      total: 2120,
    });
  });
});
