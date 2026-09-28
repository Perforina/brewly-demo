import { describe, expect, it } from "vitest";
import { isValidEmail } from "./validation";

describe("Rule 5: email validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("ada@example.com")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("ada")).toBe(false);
    expect(isValidEmail("ada@example")).toBe(false);
    expect(isValidEmail("ada @example.com")).toBe(false);
  });
});
