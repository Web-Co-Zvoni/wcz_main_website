# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tradespeople (živnostníci) and small businesses from Plzeň and the surrounding area — plumbers, electricians, carpenters, painters, car services, hairdressers, bakeries, builders. They have an outdated site or none, aren't found on Google, and have no time to deal with it. They evaluate the agency mostly on a phone between jobs.

## Product Purpose

webcozvoni.cz is the site of a one-person web agency (Matěj Kronus, Plzeň). It sells websites built so that local customers find the tradesperson and call — plus local SEO, booking/enquiry forms, e-shops, hosting and care, copywriting and photos. Success is a submitted enquiry form (or an e-mail).

## Positioning

- One-time price, the site and domain belong to the client — no subscription ("Bez keců a paušálů za nic").
- First design free within 72 hours, before anything is paid; launch within 14 days.
- 10 % discount if the agency is late through its own fault.
- Local and personal: one phone number instead of five suppliers, will drive out to photograph the workshop.

## Operating Context

Visitors arrive on mobile and desktop; the primary action is the Netlify enquiry form, the secondary one e-mail (info@webcozvoni.cz). As of 2026-10-05 the phone number (608 228 124) appears only in the header and the footer — the agency does not want calls to be the main channel, so sections point to the form or e-mail instead. The site is a single-page landing page with sections: Hero, Services, Process, Concepts (morph gallery), Pricing, FAQ, Contact, Footer. Since 2026-10-09 it also has detail pages: one per trade (/obory/…: what the site does for that trade, how it is optimised, a funnel to the matching concepts, the form) and one per concept (/koncepty/…: illustrative preview in a browser frame, package and price, process, an empty review slot, next concept, the form). Both open from the home-page carousels by a photo morph (src/lib/morph.tsx, src/lib/router.ts).

## Capabilities and Constraints

- React 19 + Vite + Tailwind CSS v4 + framer-motion + Lenis smooth scroll; WebGL effects via three/ogl. Deployed on Netlify.
- Contact form must stay a working Netlify form (`name="poptavka"`, honeypot `bot-field`, fields jmeno, telefon, email, obor, zprava).
- All copy lives in `src/content.ts`; Czech typography helper `cz()` in `src/utils/typo.ts`.
- Legal details (IČO, address) are verified against ARES — do not edit without checking.
- Being built desktop-first; mobile pass comes after the full desktop version.

## Brand Commitments

- Name and wordmark webcozvoni.cz, bell mark, "Weby, co zvoní." claim; plain, direct Czech voice, no marketing fluff.
- Hero and Footer are locked as of 2026-10-05 — do not change them. Concepts became a WebGL morph gallery and FAQ a scroll-stack deck at the owner's request (2026-10-06). Pricing keeps its structure; it was only enlarged at the owner's request.
- When redesigning sections, keep their facts and messages; wording may be shortened or regrouped, nothing new invented.

## Evidence on Hand

- No finished client websites, testimonials or reviews yet — the portfolio is explicitly "industry concepts" with illustrative stock photos (Pexels). Never fabricate references, reviews, client counts or results.
- Real facts usable as proof: prices (9 900 / 19 900 Kč / custom), timelines (72 h design, 10–14 days launch, 24 h reply), 10 % late discount, hosting from 1 800 Kč/year with the first year included.

## Product Principles

- Honesty over hype: every claim is a concrete, checkable promise.
- The enquiry is the goal — every section should make sending the form (or an e-mail) easier; never push visitors to call.
- Speak like a tradesperson's neighbour, not an agency.
