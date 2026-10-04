import { MARQUEE_TRADES } from "../content";
import { BellMark } from "./ui";

export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {MARQUEE_TRADES.map((t) => (
        <span key={t} className="flex items-center">
          <span className="display px-7 text-[clamp(1.3rem,2.4vw,1.9rem)] text-paper/75 md:px-10">{t}</span>
          <BellMark className="size-7 shrink-0 text-accent drop-shadow-[0_0_8px_var(--color-accent)]" strokeWidth={9} compact />
        </span>
      ))}
    </div>
  );

  return (
    <section aria-hidden className="relative overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="animate-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </section>
  );
}
