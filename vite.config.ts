import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { NICHE_PAGE, NICHE_PAGES, NICHES, ROUTES, SITE } from "./src/content";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One static page per trade in NICHES: writes obory/<slug>/index.html from src/pages/niche.template.html
 * (own title, description and canonical for search engines) and adds each as a build entry.
 * The generated folder is git-ignored — edit content.ts or the template instead.
 */
function nichePages(): Plugin {
  return {
    name: "niche-pages",
    config() {
      const template = fs.readFileSync(path.resolve(__dirname, "src/pages/niche.template.html"), "utf8");
      const input: Record<string, string> = { main: path.resolve(__dirname, "index.html") };

      for (const n of NICHES.items) {
        const page = NICHE_PAGES[n.slug];
        if (!page) throw new Error(`NICHE_PAGES is missing "${n.slug}"`);
        const route = ROUTES.niche(n.slug);
        const url = `https://${SITE.domain}${route}`;
        const breadcrumbs = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: NICHE_PAGE.home, item: `https://${SITE.domain}/` },
            { "@type": "ListItem", position: 2, name: n.name, item: url },
          ],
        };
        const html = template
          .replace(/%TITLE%/g, escapeHtml(NICHE_PAGE.metaTitle(page.heading)))
          .replace(/%DESCRIPTION%/g, escapeHtml(NICHE_PAGE.metaDescription(page.heading)))
          .replace(/%URL%/g, url)
          .replace(/%SLUG%/g, n.slug)
          .replace("%BREADCRUMBS%", JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"));

        const file = path.join(__dirname, route, "index.html");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== html) fs.writeFileSync(file, html);
        input[`niche-${n.slug}`] = file;
      }

      return { build: { rollupOptions: { input } } };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nichePages()],
  server: {
    watch: {
      ignored: ["**/dist/**", "**/.astro/**", "**/.vite/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
