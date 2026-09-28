import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Chip, Eyebrow, Reveal } from "./ui";

const MONTHS_GEN = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];

const TRADES = [
  "Instalatérství · voda · topení",
  "Elektroinstalace",
  "Malířství · natěračství",
  "Truhlářství · stolářství",
  "Autoservis",
  "Kadeřnictví · kosmetika · barber",
  "Stavebnictví · zednictví",
  "Gastro · pekařství",
  "Jiné řemeslo",
  "Malá firma · služby",
];

const inputCls =
  "w-full rounded-xl border border-paper/12 bg-ink px-4.5 py-3.5 text-[15px] text-paper placeholder:text-mute/60 outline-none transition-all duration-300 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(255,92,31,0.15)]";

export default function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const nextMonth = MONTHS_GEN[(new Date().getMonth() + 1) % 12];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("sent"), 1100);
  };

  return (
    <section id="kontakt" className="relative overflow-hidden bg-coal py-24 md:py-32">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_80%_20%,black,transparent)]" />
      <div className="absolute -bottom-40 right-0 h-[420px] w-[620px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* left — pitch + contacts */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>08 — Kontakt</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 stretch font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.6rem,5.5vw,4.8rem)]">
                Chcete web,
                <br />
                co <span className="text-accent">zvoní?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mute">
                Formulář vyplníte za dvě minuty. Do 24 hodin se ozveme —{" "}
                <span className="text-paper">většinou během pár hodin</span> — a domluvíme si krátký hovor.
                Žádný spam, žádné „dobré dopoledne, volám z call centra“.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Chip className="border-leaf/30 text-leaf">
                  <span className="size-1.5 animate-blink rounded-full bg-leaf" />
                  Volná kapacita od {nextMonth}
                </Chip>
                <Chip>První návrh do 72 hodin</Chip>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col gap-2">
                <a
                  href="tel:+420777284596"
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-accent p-6 text-ink transition-all duration-300 hover:bg-flame"
                >
                  <span className="relative z-10">
                    <span className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] opacity-80">
                      <span className="relative flex size-2">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-ink opacity-60" />
                        <span className="relative size-2 rounded-full bg-ink" />
                      </span>
                      Zvedáme po–pá 8:00–17:00
                    </span>
                    <span className="stretch mt-1 block text-3xl font-black tracking-tight md:text-4xl">
                      777 284 596
                    </span>
                  </span>
                  <span className="relative z-10 grid size-14 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-12">
                    <Phone className="size-6" fill="currentColor" />
                  </span>
                </a>

                <div className="grid gap-2 sm:grid-cols-2">
                  <a
                    href="mailto:info@webcozvoni.cz"
                    className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-card p-5 transition-colors duration-300 hover:border-accent/50"
                  >
                    <Mail className="size-5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">E-mail</span>
                      <span className="text-[14.5px] font-bold">info@webcozvoni.cz</span>
                    </span>
                  </a>
                  <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-card p-5">
                    <MapPin className="size-5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Kde nás najdete</span>
                      <span className="text-[14.5px] font-bold">Plzeň — a za vámi přijedeme</span>
                    </span>
                  </div>
                </div>

                <p className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                  <Clock className="size-3.5" />
                  Když nezvedneme, jsme u klienta — ozveme se zpět
                </p>
              </div>
            </Reveal>
          </div>

          {/* right — form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <div className="relative rounded-3xl border border-paper/10 bg-card p-7 md:p-10">
                {state === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex min-h-[480px] flex-col items-center justify-center text-center"
                  >
                    <span className="relative grid size-20 place-items-center rounded-full bg-leaf/15 text-leaf">
                      <span className="pulse-ring" />
                      <CheckCircle2 className="size-9" />
                    </span>
                    <h3 className="mt-7 stretch text-3xl font-extrabold tracking-tight">Díky, je to u nás.</h3>
                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mute">
                      Ozveme se do 24 hodin — většinou mnohem dřív. Když to hodně hoří, rovnou volejte{" "}
                      <a href="tel:+420777284596" className="font-bold text-accent">
                        777 284 596
                      </a>
                      .
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} noValidate={false} className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h3 className="stretch text-2xl font-extrabold tracking-tight">Nezávazná poptávka</h3>
                      <Chip className="hidden sm:inline-flex">2 minuty práce</Chip>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          Jméno a příjmení *
                        </span>
                        <input required name="jmeno" placeholder="Jan Novák" className={inputCls} />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          Telefon *
                        </span>
                        <input
                          required
                          name="telefon"
                          type="tel"
                          placeholder="777 123 456"
                          className={inputCls}
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          E-mail
                        </span>
                        <input name="email" type="email" placeholder="jan@firma.cz" className={inputCls} />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          Čím se živíte? *
                        </span>
                        <select required name="obor" className={inputCls} defaultValue="">
                          <option value="" disabled>
                            Vyberte obor…
                          </option>
                          {TRADES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                        Co potřebujete? *
                      </span>
                      <textarea
                        required
                        name="zprava"
                        rows={4}
                        placeholder="Např.: Mám starý web z roku 2015 a potřebuju nový. Hlavně aby mě lidi našli v Plzni a mohli rovnou volat…"
                        className={`${inputCls} resize-none`}
                      />
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-mute">
                      <input
                        required
                        type="checkbox"
                        className="mt-0.5 size-4.5 shrink-0 cursor-pointer appearance-none rounded-md border border-paper/25 bg-ink transition-colors checked:border-accent checked:bg-accent"
                      />
                      Souhlasím se zpracováním údajů za účelem vyřízení poptávky. Žádný spam — fakt.
                    </label>

                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group mt-2 flex items-center justify-center gap-2.5 rounded-full bg-accent py-4.5 text-[16px] font-bold tracking-tight text-ink transition-all duration-300 hover:bg-flame hover:shadow-[0_0_44px_-8px_var(--color-accent)] disabled:opacity-70"
                    >
                      {state === "sending" ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          Odesíláme…
                        </>
                      ) : (
                        <>
                          Odeslat poptávku
                          <Send className="size-4.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                    <p className="flex items-center justify-center gap-2 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                      <ArrowRight className="size-3.5 text-accent" />
                      Odpovídáme do 24 hodin · první návrh zdarma
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
