import type Lenis from "lenis";
import { SETTINGS } from "../content";

/** the page's one Lenis instance, so page changes can jump the scroll without fighting it */
let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

/** jump to y at once — Lenis re-measures first, the page under it may just have been swapped */
export function jumpTo(y: number) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}

/** jump to a section (#id) with the same offset the smooth anchor links use */
export function jumpToHash(hash: string) {
  const el = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
  jumpTo(el ? el.getBoundingClientRect().top + window.scrollY + SETTINGS.smoothScrollOffset : 0);
}

/** hold the wheel still while a page transition runs */
export function lockScroll(on: boolean) {
  if (on) lenis?.stop();
  else lenis?.start();
}

/** set while a photo is flying between pages — the carousels hold still so it lands where it left */
export const transition = { busy: false };
