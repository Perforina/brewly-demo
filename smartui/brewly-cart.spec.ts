import { expect, test } from "@playwright/test";
import { smartuiSnapshot } from "@lambdatest/playwright-driver";

test("Brewly cart looks right", async ({ page }) => {
  // Ethiopia Yirgacheffe + Kenya AA: subtotal $38.00, shipping $5.00, total $43.00
  await page.addInitScript(() =>
    localStorage.setItem(
      "brewly-cart",
      JSON.stringify({
        lines: [
          { productId: "ethiopia-yirgacheffe", quantity: 1 },
          { productId: "kenya-aa", quantity: 1 },
        ],
        coupon: null,
      }),
    ),
  );
  await page.goto("/cart");
  await page.waitForSelector("html[data-intro-done]");

  // Functional checks: the button is there and the total is right.
  await expect(page.getByRole("link", { name: "Proceed to checkout" })).toBeVisible();
  await expect(page.getByText("$43.00", { exact: true })).toBeVisible();

  // Visual check: SmartUI compares this screen with the approved baseline.
  await smartuiSnapshot(page, "Brewly Cart");
});
