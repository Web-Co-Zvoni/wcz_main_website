// Downloads the Pexels photos the site uses into public/foto/, so visitors' browsers never talk to
// Pexels: no third-party cookies (Pexels' CDN sets Cloudflare's __cf_bm and _cfuvid) and no IP
// addresses handed to a third party. The Pexels licence allows this, attribution is optional.
//
// Run after adding a photo to src/content.ts:  node scripts/fetch-photos.mjs
// It reads the ids from nichePhoto(…) and pexels(…) there and skips files already downloaded.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "foto");
const content = readFileSync(join(root, "src", "content.ts"), "utf8");
const ids = (fn) => [...content.matchAll(new RegExp(`\\b${fn}\\((\\d+)\\)`, "g"))].map((m) => m[1]);

// the widths MorphImage offers in its srcset (src/lib/morph.tsx), the largest is heroPhoto
const WIDTHS = [800, 1280, 1920];
const crop = (w, h) => ({ name: `${w}x${h}`, query: `fit=crop&h=${h}&w=${w}` });
const width = (w) => ({ name: `w${w}`, query: `w=${w}` });
const variants = new Map();
const want = (id, list) => variants.set(id, [...(variants.get(id) ?? []), ...list]);

// trade cards: a square crop, opened into a full-width hero
for (const id of ids("nichePhoto")) want(id, [crop(600, 600), ...WIDTHS.map(width)]);
// concept cards: the card crop, its taller carousel crop (cardPhoto), and the hero
for (const id of ids("pexels")) want(id, [crop(800, 1000), crop(740, 1120), ...WIDTHS.map(width)]);

mkdirSync(out, { recursive: true });
let fetched = 0;
for (const [id, list] of variants) {
  for (const v of new Map(list.map((v) => [v.name, v])).values()) {
    const file = join(out, `${id}-${v.name}.webp`);
    if (existsSync(file)) continue;
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&${v.query}`;
    // Pexels sends WebP when asked for it
    const res = await fetch(url, { headers: { Accept: "image/webp" } });
    if (!res.ok || res.headers.get("content-type") !== "image/webp") throw new Error(`${url}: ${res.status} ${res.headers.get("content-type")}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fetched++;
  }
}
console.log(`${variants.size} photos, ${fetched} files downloaded into public/foto/`);
