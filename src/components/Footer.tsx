import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { FOOTER, NAV_LINKS, SITE } from "../content";
import { Logo } from "./Header";

export default function Footer() {
  const legalDetails = [
    SITE.legalName,
    `IČO ${SITE.ico}`,
    SITE.legalAddress,
    SITE.legalNote,
    SITE.legalRegistry,
  ];

  return (
    <footer className="relative overflow-hidden border-t border-paper/10 pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mute">
              {SITE.footerDescription}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 font-mono text-[13px] tracking-wider text-mute">
              <a href={`tel:${SITE.phoneLink}`} className="flex items-center gap-3 transition-colors hover:text-accent">
                <Phone className="size-4 text-accent" /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 transition-colors hover:text-accent">
                <Mail className="size-4 text-accent" /> {SITE.email}
              </a>
              <span className="flex items-center gap-3">
                <MapPin className="size-4 text-accent" /> {SITE.location}
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">{FOOTER.navigationLabel}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[15px] font-semibold text-paper/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">{FOOTER.servicesLabel}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {FOOTER.services.map((s) => (
                <li key={s}>
                  <a href="#sluzby" className="text-[15px] font-semibold text-paper/80 transition-colors hover:text-accent">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="relative border-t border-paper/10">
        <svg viewBox="0 0 1200 150" className="w-full" aria-hidden>
          <text
            x="600"
            y="126"
            textAnchor="middle"
            textLength="1170"
            lengthAdjust="spacingAndGlyphs"
            className="fill-paper/[0.06]"
            style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 150, fontStretch: "125%" }}
          >
            {SITE.wordmark}
          </text>
        </svg>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-y-1 px-5 pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute/60 md:justify-start md:px-8">
          {legalDetails.map((detail, index) => (
            <span key={detail}>
              {index > 0 && <span aria-hidden="true">{" · "}</span>}
              {detail}
            </span>
          ))}
          <p className="basis-full text-center md:text-left">
            <a href="/ochrana-osobnich-udaju.html" className="transition-colors hover:text-accent">
              Zásady zpracování osobních údajů
            </a>
          </p>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} {SITE.domain}</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" />
            {SITE.footerSignoff}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 transition-colors hover:text-accent"
          >
            {FOOTER.backToTop}
            <span className="grid size-8 place-items-center rounded-full border border-paper/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/60">
              <ArrowUp className="size-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
