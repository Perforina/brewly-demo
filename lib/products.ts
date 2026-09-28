export type Product = {
  id: string;
  name: string;
  /** Price in cents. */
  price: number;
};

// PRD rule 1: catalog of 6 coffee bags.
export const PRODUCTS: Product[] = [
  { id: "house-blend", name: "House Blend", price: 1200 },
  { id: "ethiopia-yirgacheffe", name: "Ethiopia Yirgacheffe", price: 1800 },
  { id: "colombia-supremo", name: "Colombia Supremo", price: 1600 },
  { id: "kenya-aa", name: "Kenya AA", price: 2000 },
  { id: "decaf-swiss-water", name: "Decaf Swiss Water", price: 1500 },
  { id: "espresso-roast", name: "Espresso Roast", price: 1400 },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
