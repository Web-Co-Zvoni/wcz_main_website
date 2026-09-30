import { BellRing, PenTool, PhoneCall, Rocket } from "lucide-react";
import { PROCESS } from "../content";
import { Eyebrow, Reveal, SectionHead } from "./ui";

const STEP_ICONS = [PhoneCall, PenTool, Rocket, BellRing];

export default function Process() {
  return (
    <section id="postup" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="03"
          eyebrow={PROCESS.eyebrow}
          title={
            <>
              {PROCESS.titleLead}
              <br />
              k <span className="text-accent">{PROCESS.titleAccent}</span>
            </>
          }
          desc={PROCESS.description}
        />

        <div className="mt-16 grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {PROCESS.steps.map((s, i) => {
            const Icon = STEP_ICONS[i];
            const number = String(i + 1).padStart(2, "0");
            return (
            <Reveal key={number} delay={i * 0.12} className="relative">
              {/* connector */}
              {i < PROCESS.steps.length - 1 && (
                <div className="absolute -right-6 top-7 hidden h-px w-6 border-t border-dashed border-paper/20 xl:block" />
              )}
              <div className="group h-full">
                <div className="flex items-center justify-between">
                  <div className="grid size-14 place-items-center rounded-2xl border border-paper/10 bg-card text-accent transition-all duration-500 group-hover:scale-110 group-hover:border-accent/50">
                    <Icon className="size-6" strokeWidth={2} />
                  </div>
                  <span className="stretch text-5xl font-black text-paper/10 transition-colors duration-500 group-hover:text-accent/30">
                    {number}
                  </span>
                </div>
                <h3 className="mt-6 stretch text-xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{s.text}</p>
                <p className="mt-4 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent/80">
                  <span className="size-1 rounded-full bg-accent" />
                  {s.meta}
                </p>
              </div>
            </Reveal>
          );})}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/10 via-card to-card p-8 md:flex-row md:items-center md:p-10">
            <div>
              <Eyebrow dot={false} className="text-accent">
                {PROCESS.guaranteeEyebrow}
              </Eyebrow>
              <p className="mt-3 stretch max-w-xl text-2xl font-extrabold tracking-tight md:text-3xl">
                {PROCESS.guarantee}
              </p>
            </div>
            <a
              href="#kontakt"
              className="shrink-0 rounded-full bg-accent px-7 py-4 text-[15px] font-bold text-ink transition-all duration-300 hover:bg-flame hover:shadow-[0_0_40px_-8px_var(--color-accent)]"
            >
              {PROCESS.guaranteeCta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
