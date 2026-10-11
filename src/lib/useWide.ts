import { useSyncExternalStore } from "react";

/** md and up — below it the site swaps its heavy effects for lighter ones (phones) */
const WIDE = "(min-width: 48rem)";

/** the same test, once, outside React (e.g. to start fetching desktop-only code early) */
export const isWide = () => typeof window !== "undefined" && window.matchMedia(WIDE).matches;

export function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => true
  );
}
