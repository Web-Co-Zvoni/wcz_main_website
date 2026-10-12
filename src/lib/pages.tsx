/**
 * The sub-pages live in their own chunks, so the home page doesn't carry them. Once the home page
 * has settled they are fetched in the background (`preloadPages`), and a page morph waits for its
 * page (`preloadPage`) before it swaps — so the photo always has a spot to land on.
 */
import { use, type ComponentType } from "react";
import { afterLoadIdle } from "../utils/idle";

function preloadable<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  let Comp: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  const preload = () =>
    (pending ??= load().then((m) => {
      Comp = m.default;
    }));
  // one component type whether or not the chunk was there first, so React never remounts the page
  function Page(props: P) {
    if (!Comp) use(preload());
    const C = Comp!;
    return <C {...props} />;
  }
  return { Page, preload };
}

const concept = preloadable(() => import("../pages/ConceptPage"));
const niche = preloadable(() => import("../pages/NichePage"));

export const ConceptPage = concept.Page;
export const NichePage = niche.Page;

/** make sure the page a link leads to is loaded (home and 404 always are) */
export function preloadPage(kind: string): Promise<void> {
  if (kind === "concept") return concept.preload();
  if (kind === "niche") return niche.preload();
  return Promise.resolve();
}

/** fetch every sub-page once the browser has nothing better to do */
export function preloadPages() {
  afterLoadIdle(() => {
    void concept.preload();
    void niche.preload();
  });
}
