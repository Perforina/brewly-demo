// Visual-only product data: bag colours and tasting notes. Kept separate from
// the catalog so branding changes never touch names, prices or pricing logic.

export type ProductStyle = {
  /** Main bag colour. */
  bag: string;
  /** Darker shade for the crimped top and shading. */
  shade: string;
  tastingNote: string;
};

const FALLBACK: ProductStyle = { bag: "#7A4A2A", shade: "#5A3520", tastingNote: "" };

const STYLES: Record<string, ProductStyle> = {
  "house-blend": { bag: "#7A4A2A", shade: "#5A3520", tastingNote: "Milk chocolate, toasted almond, caramel" },
  "ethiopia-yirgacheffe": { bag: "#D4A437", shade: "#A87E22", tastingNote: "Blueberry, jasmine, honey" },
  "colombia-supremo": { bag: "#3E6B3A", shade: "#2C4F29", tastingNote: "Red apple, cocoa, brown sugar" },
  "kenya-aa": { bag: "#8E1F24", shade: "#681519", tastingNote: "Blackcurrant, grapefruit, cane sugar" },
  "decaf-swiss-water": { bag: "#3C5F8A", shade: "#2A4566", tastingNote: "Cocoa, hazelnut, dried fig" },
  "espresso-roast": { bag: "#241A15", shade: "#120C09", tastingNote: "Dark chocolate, molasses, smoke" },
};

export function getProductStyle(id: string): ProductStyle {
  return STYLES[id] ?? FALLBACK;
}
