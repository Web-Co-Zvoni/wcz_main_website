/**
 * After `vite build` (the app) and `vite build --ssr` (src/entry-server.tsx → dist-server/), writes
 * every page as its own static HTML: the rendered text, its own title, description and canonical.
 * Also writes dist/404.html (served with status 404 for unknown paths, see wrangler.jsonc) and a
 * sitemap listing every page.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const server = join(root, "dist-server");
const ORIGIN = "https://webcozvoni.cz";

// React's production server build: the dev build writes error messages and stack traces
// (with the build machine's paths) into the HTML wherever a lazy part of the page is skipped
process.env.NODE_ENV = "production";

const { ready, render, pages, notFound } = await import(pathToFileURL(join(server, "entry-server.js")).href);
await ready();
// the stylesheet goes into the page itself: one round trip less before the first paint (~19 kB compressed)
const template = readFileSync(join(dist, "index.html"), "utf8").replace(
  /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
  (_, href) => `<style>${readFileSync(join(dist, href), "utf8").replace(/<\/style/gi, "<\\/style")}</style>`
);
if (template.includes('rel="stylesheet"')) throw new Error("index.html: stylesheet link not inlined");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** sets the content of the <meta> whose `attr` is `key` — every page's template has them all */
function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${key}">`);
  return html.replace(re, `$1${esc(value)}$2`);
}

function page(html, { title, description, url, body, noindex = false }) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", description);
  if (noindex) {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
    html = html.replace("</title>", `</title>\n    <meta name="robots" content="noindex" />`);
  } else {
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
    html = setMeta(html, "property", "og:url", url);
  }
  if (!html.includes('<div id="root"></div>')) throw new Error('index.html is missing <div id="root"></div>');
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const list = pages();
for (const p of list) {
  const html = page(template, { ...p, url: ORIGIN + p.path, body: render(p.path) });
  const out = join(dist, p.path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${p.path}`);
}

writeFileSync(
  join(dist, "404.html"),
  page(template, {
    title: notFound.title,
    description: list[0].description,
    body: render(notFound.path),
    noindex: true,
  })
);
console.log("prerendered 404.html");

const today = new Date().toISOString().slice(0, 10);
const urls = [...list.map((p) => p.path), "/ochrana-osobnich-udaju.html"];
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${ORIGIN}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}
</urlset>
`
);
console.log(`sitemap: ${urls.length} addresses`);

rmSync(server, { recursive: true, force: true });
