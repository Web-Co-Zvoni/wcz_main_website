/**
 * Root font size relative to the 16px default. The desktop layout runs at 85% (see index.css),
 * so px values computed in JS multiply by this to stay in step with the rem-based CSS.
 */
export function remScale() {
  if (typeof window === "undefined") return 1;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
}
