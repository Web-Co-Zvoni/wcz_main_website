import { Clock, MonitorSmartphone, Search } from "lucide-react";
import { PROBLEM } from "../content";
import { Reveal, SectionHead } from "./ui";

const PAIN_ICONS = [MonitorSmartphone, Search, Clock];

export default function Problem() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="01"
          eyebrow={PROBLEM.eyebrow}
          title={
            <>
              {PROBLEM.titleLead} <span className="text-accent">{PROBLEM.titleAccent}</span>
              <br />
              {PROBLEM.titleEnd}
            </>
          }
          desc={PROBLEM.description}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PROBLEM.items.map((p, i) => {
            const Icon = PAIN_ICONS[i];
            const number = String(i + 1).padStart(2, "0");
            return (
            <Reveal key={number} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-paper/10 bg-card p-8 transition-colors duration-500 hover:border-accent/40">
                <div className="absolute -right-4 -top-6 stretch text-[104px] font-black leading-none text-paper/[0.04] transition-colors duration-500 group-hover:text-accent/10">
                  {number}
                </div>
                <div className="relative">
                  <div className="grid size-12 place-items-center rounded-2xl border border-paper/10 bg-ink text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="size-5.5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-6 stretch text-xl font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{p.text}</p>
                </div>
              </div>
            </Reveal>
          );})}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-12 max-w-2xl border-l-2 border-accent pl-6 text-[17px] leading-relaxed text-paper/85">
            {PROBLEM.closingStart}<strong>{PROBLEM.closingGoogle}</strong>{PROBLEM.closingMiddle}
            <strong>{PROBLEM.closingContact}</strong>{PROBLEM.closingEnd}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
