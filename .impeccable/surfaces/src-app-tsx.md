---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/Services.tsx","src/components/Process.tsx","src/components/Faq.tsx","src/components/Contact.tsx","src/components/Marquee.tsx"]
---

## Scope

Single-page landing for webcozvoni.cz. Visitor mode: Persuade. This brief covers the body below the hero: trades strip, Services, Process, FAQ, Contact. Hero, Concepts (Portfolio), Pricing and Footer are locked. Problem section and the electric bell above Contact are removed. Desktop-first; mobile pass later.

Audience/job: a tradesperson from Plzeň checking whether this is worth a call. Action: call 608 228 124 or send the Netlify form. Proof: concrete promises only (72 h design, 14 days, one-time price, 10 % late discount) — no invented references.

## Direction contract

THESIS: Services and Process are bento grids of dark tiles (2026-10-06, replaced the pinned horizontal journey). Every tile does one job: a working mini-demo, a milestone with its own small picture, or the one promise (10 % guarantee) in a red-washed tile.

OWN-WORLD: The hero's world, extended: charcoal #141215 night, signal red #ff3b47 / #e0182a as the live current, paper #f4efec type, Montserrat 800 display. Tiles: 28px radius, hairline border, cursor-following red spotlight and lit edge (BentoCard in src/components/Bento.tsx). In Process a red current threads through the four milestone tiles and fills on scroll.

STORY: Visitor sees the trades they belong to, then rides through six services, each shown doing its job; the road turns into four dated milestones (Den 1, 3, 14, Pořád) ending at the 10 % guarantee; FAQ answers objections plainly; Contact puts the phone first and the form beside it.

FIRST VIEWPORT: Services 4×4 grid — a 2×2 intro tile (heading, the six services, CTA to #kontakt + e-mail, swinging bell behind), tall tiles for the phone-shaped demos (web, SEO, booking, shop), wide tiles for chat and photo. Process: title tile + guarantee tile, then Den 1 / 3 / 14 / Pořád tiles.

FORM: Bento grid.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
