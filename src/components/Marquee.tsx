import { Asterisk } from "lucide-react";
import { MARQUEE_TRADES } from "../content";

export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {MARQUEE_TRADES.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="stretch px-3 text-lg font-extrabold uppercase tracking-tight text-paper/80 sm:px-5 sm:text-2xl md:px-8 md:text-3xl">
            {t}
          </span>
          <Asterisk className="size-5 shrink-0 text-accent sm:size-6" strokeWidth={2.5} />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-hidden className="relative overflow-hidden border-y border-paper/10 bg-coal py-6">
      <div className="animate-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-coal to-transparent" />
    </section>
  );
}
