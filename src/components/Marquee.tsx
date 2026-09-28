import { Asterisk } from "lucide-react";

const TRADES = [
  "Instalatéři",
  "Elektrikáři",
  "Truhláři",
  "Malíři",
  "Autoservisy",
  "Kadeřnictví",
  "Obkladači",
  "Zámečníci",
  "Pekařství",
  "Klempíři",
  "Podlaháři",
  "Hodináři",
];

export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {TRADES.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="stretch px-6 text-2xl font-extrabold uppercase tracking-tight text-paper/80 md:px-8 md:text-3xl">
            {t}
          </span>
          <Asterisk className="size-6 shrink-0 text-accent" strokeWidth={2.5} />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-hidden className="relative border-y border-paper/10 bg-coal py-6">
      <div className="animate-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-coal to-transparent" />
    </section>
  );
}
