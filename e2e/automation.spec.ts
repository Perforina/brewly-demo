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
