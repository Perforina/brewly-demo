import { expect, test, type Locator, type Page } from "@playwright/test";
import { PRODUCTS } from "../lib/products";

async function openHome(page: Page) {
  await page.goto("/");
  // Set by IntroFlag after hydration + entrance animation, so the cart is interactive.
  await page.waitForSelector("html[data-intro-done]");
}

async function headerBottom(page: Page) {
  return page.locator("header").evaluate((h) => h.getBoundingClientRect().bottom);
}

/** True when the element's centre is the top-most hit target (nothing covers it). */
async function isTopmostAtCentre(locator: Locator) {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && (hit === el || el.contains(hit));
  });
}

test("the document itself scrolls, with no inner scroll container", async ({ page }) => {
  await openHome(page);
  const info = await page.evaluate(() => {
    const scrollers = [...document.querySelectorAll("body *")].filter((el) => {
      const { overflowY } = getComputedStyle(el);
      return (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;
    });
    window.scrollTo(0, 400);
    return {
      scrollingElementIsHtml: document.scrollingElement === document.documentElement,
      pageTallerThanViewport: document.documentElement.scrollHeight > window.innerHeight,
      scrolledTo: window.scrollY,
      innerScrollers: scrollers.map((el) => el.tagName + "." + el.className),
    };
  });
  expect(info.scrollingElementIsHtml).toBe(true);
  expect(info.pageTallerThanViewport).toBe(true);
  expect(info.scrolledTo).toBe(400);
  expect(info.innerScrollers).toEqual([]);
});

test("scroll-padding-top equals the sticky header height", async ({ page }) => {
  await openHome(page);
  const { padding, height } = await page.evaluate(() => ({
    padding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
    height: document.querySelector("header")!.getBoundingClientRect().height,
  }));
  expect(padding).toBe(height);
});

test("decorative layers ignore the pointer", async ({ page }) => {
  await openHome(page);
  const values = await page.evaluate(() => [
    getComputedStyle(document.querySelector(".hero")!, "::after").pointerEvents,
    ...[...document.querySelectorAll('.steam, [data-label], .hero svg, svg[viewBox="0 0 120 160"]')].map(
      (el) => getComputedStyle(el).pointerEvents,
    ),
  ]);
  expect(values.length).toBeGreaterThan(10);
  expect(new Set(values)).toEqual(new Set(["none"]));
});

test("every Add to cart button can be scrolled into view and clicked", async ({ page }) => {
  await openHome(page);

  for (const [i, product] of PRODUCTS.entries()) {
    const button = page.getByRole("button", { name: `Add ${product.name} to cart`, exact: true });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeInViewport();
    expect((await button.boundingBox())!.y).toBeGreaterThanOrEqual((await headerBottom(page)) - 1);
    expect(await isTopmostAtCentre(button)).toBe(true);

    // Playwright's click also verifies the button receives the pointer event.
    await button.click();
    await expect(page.getByRole("listitem").filter({ has: button }).getByRole("status")).toHaveText("Added to cart");
    await expect(page.getByRole("link", { name: `Cart (${i + 1})` })).toBeVisible();
  }
});

test("native scrollIntoView({block: 'start'}) never hides a button under the header", async ({ page }) => {
  await openHome(page);

  for (const product of PRODUCTS) {
    const button = page.getByRole("button", { name: `Add ${product.name} to cart`, exact: true });
    await button.evaluate((el) => el.scrollIntoView({ block: "start" }));
    const top = await button.evaluate((el) => el.getBoundingClientRect().top);
    // Near the page bottom the browser can't scroll further, so the button may sit lower; never higher.
    expect(top).toBeGreaterThanOrEqual((await headerBottom(page)) - 1);
    expect(await isTopmostAtCentre(button)).toBe(true);
  }
});

/**
 * Records every text node the page ever renders (from before first paint), so a
 * test can assert nothing was shown half-filled or from pre-hydration state.
 */
async function recordRenderedText(page: Page) {
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __seenText: string[] }).__seenText = seen;
    const record = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Record the node and its element: React can split one visible phrase across text nodes.
        for (const text of [node.nodeValue, node.parentElement?.textContent]) {
          if (text?.trim()) seen.push(text.trim());
        }
      } else node.childNodes.forEach(record);
    };
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "characterData") record(m.target);
        m.addedNodes.forEach(record);
      }
    }).observe(document, { childList: true, subtree: true, characterData: true });
  });
  return () => page.evaluate(() => (window as unknown as { __seenText: string[] }).__seenText);
}

const seed = (page: Page, key: string, value: unknown) =>
  page.addInitScript(([k, v]) => localStorage.setItem(k, v), [key, JSON.stringify(value)] as const);

test("confirmation renders order number and total atomically, never a bare label", async ({ page }) => {
  await seed(page, "brewly-last-order", { orderNumber: "BRW-482913", total: 1700, name: "Ada", email: "ada@example.com" });
  const seen = await recordRenderedText(page);
  await page.goto("/confirmation");

  const total = page.getByTestId("order-total");
  const number = page.getByTestId("order-number");
  await expect(total).toHaveText("Total: $17.00");
  await expect(number).toHaveText("Order number: BRW-482913");
  // One text node holding label and value together.
  for (const el of [total, number]) {
    expect(await el.evaluate((p) => p.childNodes.length === 1 && p.firstChild!.nodeType === Node.TEXT_NODE)).toBe(true);
  }
  const labels = [...new Set((await seen()).filter((t) => /^(Total|Order number):/.test(t)))];
  expect(labels).toEqual(["Order number: BRW-482913", "Total: $17.00"]);
});

test("confirmation shows only a neutral loading state before the order loads", async ({ page }) => {
  const seen = await recordRenderedText(page);
  await page.goto("/confirmation");
  await expect(page.getByRole("heading", { name: "No recent order" })).toBeVisible();
  expect((await seen()).filter((t) => /Total|Order confirmed|Order number/.test(t))).toEqual([]);
});

test("cart never renders totals or count from the empty pre-hydration cart", async ({ page }) => {
  // Kenya AA x2 = $40.00, SAVE10 -$4.00, shipping $5.00, total $41.00
  await seed(page, "brewly-cart", { lines: [{ productId: "kenya-aa", quantity: 2 }], coupon: "SAVE10" });
  const seen = await recordRenderedText(page);
  await page.goto("/cart");

  await expect(page.getByRole("link", { name: "Cart (2)" })).toBeVisible();
  await expect(page.getByText("Qty: 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Coupon SAVE10 applied", { exact: true })).toBeVisible();
  const text = await seen();
  expect(text).not.toContain("Cart (0)");
  expect(text).not.toContain("$0.00");
  expect(text).not.toContain("Your cart is empty.");
  expect(text.filter((t) => t.startsWith("$") || t.startsWith("-$"))).toEqual(
    expect.arrayContaining(["$40.00", "-$4.00", "$5.00", "$41.00"]),
  );
});

test("placing an order shows the same final total on confirmation", async ({ page }) => {
  await seed(page, "brewly-cart", { lines: [{ productId: "kenya-aa", quantity: 2 }], coupon: "SAVE10" });
  await page.goto("/checkout");
  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Shipping address").fill("1 Analytical Way");
  await page.getByRole("button", { name: "Place order" }).click();

  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByTestId("order-total")).toHaveText("Total: $41.00");
  await expect(page.getByTestId("order-number")).toHaveText(/^Order number: BRW-\d{6}$/);
});
