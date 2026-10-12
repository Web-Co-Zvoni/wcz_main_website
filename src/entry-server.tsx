/**
 * Build-time rendering (scripts/prerender.mjs): every page is written out as static HTML, so
 * search engines and AI crawlers that don't run JavaScript still get the full text and the <h1>.
 * In the browser main.tsx renders the app afresh over it.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { CONCEPT_DETAILS, CONCEPT_PAGE, META, NICHE_DETAILS, NICHE_PAGE, NICHES, PORTFOLIO, ROUTES } from "./content";
import { setServerPath } from "./lib/router";

export type PageMeta = { path: string; title: string; description: string };

const clip = (s: string, max = 160) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(" ", max - 1)) + "…");

/** every page the site has, with its tab title and search description */
export function pages(): PageMeta[] {
  return [
    { path: "/", title: META.homeTitle, description: META.homeDescription },
    ...NICHES.items
      .filter((n) => NICHE_DETAILS[n.slug])
      .map((n) => {
        const d = NICHE_DETAILS[n.slug];
        return { path: ROUTES.niche(n.slug), title: NICHE_PAGE.documentTitle(d.title), description: META.nicheDescription(d.title) };
      }),
    ...PORTFOLIO.items
      .filter((p) => CONCEPT_DETAILS[p.slug])
      .map((p) => ({
        path: ROUTES.concept(p.slug),
        title: CONCEPT_PAGE.documentTitle(p.title),
        description: clip(CONCEPT_DETAILS[p.slug].about),
      })),
  ];
}

/** rendered as dist/404.html — any path that isn't a page shows the "not found" page */
export const notFound = { path: "/404", title: META.notFoundTitle };

export function render(path: string) {
  setServerPath(path);
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
