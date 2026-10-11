import { useSyncExternalStore } from "react";

/** md and up — below it the site swaps its heavy effects for lighter ones (phones) */
const WIDE = "(min-width: 48rem)";

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
