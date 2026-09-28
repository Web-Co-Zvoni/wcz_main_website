import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Header";

const NAV = [
  { label: "Služby", href: "#sluzby" },
  { label: "Postup", href: "#postup" },
  { label: "Koncepty", href: "#reference" },
  { label: "Ceník", href: "#cenik" },
  { label: "Otázky", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

const SERVICES = ["Weby na míru", "Lokální SEO", "Rezervace a poptávky", "E-shopy", "Správa a hosting", "Texty a fotky"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-paper/10 pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mute">
              Poctivé weby pro živnostníky a malé firmy z Plzně a okolí. Bez keců, za férovou cenu — a tak,
              aby vám díky nim zvonil telefon.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 font-mono text-[13px] tracking-wider text-mute">
              <a href="tel:+420777284596" className="flex items-center gap-3 transition-colors hover:text-accent">
                <Phone className="size-4 text-accent" /> 777 284 596
              </a>
              <a href="mailto:info@webcozvoni.cz" className="flex items-center gap-3 transition-colors hover:text-accent">
                <Mail className="size-4 text-accent" /> info@webcozvoni.cz
              </a>
              <span className="flex items-center gap-3">
                <MapPin className="size-4 text-accent" /> Plzeň · Rokycany · Nýřany · kamkoliv autem
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">Navigace</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV.map((l) => (
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
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mute">Služby</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {SERVICES.map((s) => (
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
            WEBCOZVONÍ
          </text>
        </svg>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mute md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} webcozvoni.cz</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" />
            Vyrob poctivě v Plzni
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 transition-colors hover:text-accent"
          >
            Zpět nahoru
            <span className="grid size-8 place-items-center rounded-full border border-paper/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/60">
              <ArrowUp className="size-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
