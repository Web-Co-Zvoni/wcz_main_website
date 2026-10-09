/**
 * A few pages, no router library: the home page, one page per trade (/obory/…) and one per
 * concept (/koncepty/…). Links change pages in place, so a photo can fly from a card into the
 * page it opens (see morph.tsx). Every entry remembers where it was scrolled, and an entry
 * opened by a flying photo remembers the card it came from, so Back can fly it home.
 */
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { jumpTo, jumpToHash } from "./scroll";

export type Route = { page: "home" } | { page: "niche"; slug: string } | { page: "concept"; slug: string } | { page: "missing" };

export function parseRoute(pathname: string): Route {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/" || p === "/index.html") return { page: "home" };
  const niche = p.match(/^\/obory\/([\w-]+)$/);
  if (niche) return { page: "niche", slug: niche[1] };
  const concept = p.match(/^\/koncepty\/([\w-]+)$/);
  if (concept) return { page: "concept", slug: concept[1] };
  return { page: "missing" };
}

/** the card a page was opened from, in viewport px at the moment of the click */
export type MorphRecord = {
  path: string;
  small: string;
  large: string;
  box: { x: number; y: number; w: number; h: number; r: number };
  shade?: string;
  /** brightness the card shows at rest, for the landing on the way back */
  restLight?: number;
};

export type HistState = { idx?: number; scrollY?: number; morph?: MorphRecord };

export type Entry = {
  path: string;
  state: HistState;
  /** reached with Back/Forward: the page comes back as it was left, without its entrance */
  restored: boolean;
};

const read = (restored: boolean): Entry => ({ path: location.pathname, state: (history.state ?? {}) as HistState, restored });

history.scrollRestoration = "manual";
history.replaceState({ ...(history.state ?? {}), idx: (history.state as HistState | null)?.idx ?? 0 }, "");

let current = read(false);
const subs = new Set<() => void>();
const subscribe = (cb: () => void) => {
  subs.add(cb);
  return () => subs.delete(cb);
};
const emit = () => subs.forEach((cb) => cb());

export const useEntry = () => useSyncExternalStore(subscribe, () => current);
export const currentEntry = () => current;

/** was this page reached by a link inside the site (so Back stays on the site)? */
export const canGoBack = () => ((history.state as HistState | null)?.idx ?? 0) > 0;

/** open `path` now, synchronously — the new page is in the DOM when this returns; scroll is left alone */
export function commit(path: string, state: HistState = {}) {
  history.replaceState({ ...(history.state ?? {}), scrollY: window.scrollY }, "");
  const idx = ((history.state as HistState | null)?.idx ?? 0) + 1;
  history.pushState({ ...state, idx }, "", path);
  current = read(false);
  flushSync(emit);
}

/** follow an internal link: switch page if needed, then land on its #section or the top */
export function go(href: string) {
  const url = new URL(href, location.href);
  if (url.pathname !== current.path) commit(url.pathname);
  if (url.hash) jumpToHash(url.hash);
  else jumpTo(0);
}

/** show whatever entry the browser is on now (after Back/Forward) — safe to call twice */
export function applyPop() {
  const next = read(true);
  if (next.path !== current.path) {
    current = next;
    flushSync(emit);
  } else current = next;
}

/** Back/Forward: a handler may take the change over (and call applyPop itself); otherwise it's instant */
type PopHandler = (from: Entry, to: Entry) => boolean;
let popHandler: PopHandler | null = null;
export function onPop(h: PopHandler | null) {
  popHandler = h;
}

window.addEventListener("popstate", () => {
  const from = current;
  const to = read(true);
  if (to.path === from.path) {
    current = to;
    return;
  }
  if (popHandler?.(from, to)) return;
  applyPop();
  const y = to.state.scrollY ?? 0;
  jumpTo(y);
  // once more after the page has settled its height
  requestAnimationFrame(() => jumpTo(y));
});
