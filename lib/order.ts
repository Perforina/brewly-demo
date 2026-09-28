const STORAGE_KEY = "brewly-last-order";

export type Order = {
  orderNumber: string;
  /** Final total in cents. */
  total: number;
  name: string;
  email: string;
};

export function generateOrderNumber(): string {
  return `BRW-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function saveLastOrder(order: Order): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Ignore storage failures.
  }
}

export function loadLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
