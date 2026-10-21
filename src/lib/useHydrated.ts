import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * false while prerendering and while the browser takes the prerendered HTML over, true from the
 * render right after — for anything that can only be known in the browser (the date, the screen),
 * so the first browser render matches the HTML it takes over.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}
