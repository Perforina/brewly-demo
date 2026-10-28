import { describe, expect, it } from "vitest";
import { TEST_CARDS, chargeMock, validateCard } from "./payment";

const valid = { cardNumber: TEST_CARDS.success, expiry: "12/29", cvc: "123" };

describe("Rule 6: mock payment", () => {
  it("accepts a complete test card", () => {
    expect(validateCard(valid)).toEqual({});
  });

  it("requires every payment field", () => {
    expect(validateCard({ cardNumber: "", expiry: "", cvc: "" })).toEqual({
      cardNumber: "Card number is required",
      expiry: "Expiry is required",
      cvc: "CVC is required",
    });
  });

  it("rejects malformed payment fields", () => {
    expect(validateCard({ cardNumber: "4242 4242", expiry: "13/29", cvc: "12" })).toEqual({
      cardNumber: "Enter a 16-digit card number",
      expiry: "Use MM/YY",
      cvc: "Enter the 3-digit CVC",
    });
    expect(validateCard({ ...valid, cardNumber: "4242-4242-4242-4242" }).cardNumber).toBe(
      "Enter a 16-digit card number",
    );
  });

  it("declines only the decline test card", () => {
    expect(chargeMock(TEST_CARDS.decline)).toEqual({ ok: false, reason: "declined" });
    expect(chargeMock("4000000000000002")).toEqual({ ok: false, reason: "declined" });
    expect(chargeMock(TEST_CARDS.success)).toEqual({ ok: true });
  });
});
