import { ArrowUp } from "lucide-react";
import { FOOTER, NAV_LINKS, SITE } from "../content";
import { Logo } from "./Header";
import { cz } from "../utils/typo";

export default function Footer() {
  const legalDetails = [SITE.legalName, `IČO ${SITE.ico}`, SITE.legalAddress, SITE.legalNote, SITE.legalRegistry];

  return (
    <footer className="relative overflow-hidden border-t border-paper/[0.08] pt-16 md:pt-20">
      <span aria-hidden className="pointer-events-none absolute inset-x-[25%] top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <Logo />
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mute">{cz(SITE.footerDescription)}</p>

        <nav className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[14.5px] font-medium text-paper/80 transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-mute">
          <a href={`tel:${SITE.phoneLink}`} className="tabular-nums transition-colors hover:text-accent">
            {SITE.phone}
          </a>
          <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">
            {SITE.email}
          </a>
          <span>{SITE.location}</span>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="relative mt-14 select-none" aria-hidden>
        <svg viewBox="0 0 1200 150" className="w-full">
          <defs>
            <linearGradient id="wm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4efec" stopOpacity="0.09" />
              <stop offset="1" stopColor="#f4efec" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="600"
            y="132"
            textAnchor="middle"
            textLength="1170"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#wm)"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 150, letterSpacing: "-0.04em" }}
          >
            {/* Z and V touch at the top with this tight tracking — nudge the V along a little */}
            {SITE.wordmark.slice(0, SITE.wordmark.indexOf("ZV") + 1)}
            <tspan dx="16">{SITE.wordmark.slice(SITE.wordmark.indexOf("ZV") + 1)}</tspan>
          </text>
        </svg>
      </div>

      <div className="border-t border-paper/[0.08]">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-7 text-center text-[12.5px] text-mute/70">
          <p className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {legalDetails.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </p>
          <a href="/ochrana-osobnich-udaju.html" className="transition-colors hover:text-accent">
            {FOOTER.privacy}
          </a>
          <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <p>
              © {new Date().getFullYear()} {SITE.domain} — {SITE.footerSignoff}
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 transition-colors hover:text-accent"
            >
              {FOOTER.backToTop}
              <span className="grid size-8 place-items-center rounded-full border border-paper/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/60">
                <ArrowUp className="size-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
