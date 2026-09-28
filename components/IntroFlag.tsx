"use client";

import { useEffect } from "react";

/**
 * Marks <html> once the first-load entrance animation has finished, which
 * switches the `.rise` animation off so route changes never re-animate.
 */
export function IntroFlag() {
  useEffect(() => {
    const t = setTimeout(() => document.documentElement.setAttribute("data-intro-done", ""), 600);
    return () => clearTimeout(t);
  }, []);
  return null;
}
