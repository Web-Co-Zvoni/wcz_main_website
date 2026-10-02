import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { CONTACT, SITE } from "../content";
import { Chip, Eyebrow, Reveal } from "./ui";

const inputCls =
  "w-full rounded-xl border border-paper/12 bg-ink px-4.5 py-3.5 text-[15px] text-paper placeholder:text-mute/60 outline-none transition-all duration-300 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(255,92,31,0.15)]";

export default function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const nextMonth = CONTACT.monthsGenitive[(new Date().getMonth() + 1) % 12];
  const privacyLinkText = "jak nakládáme s vašimi údaji";
  const privacyNoteParts = CONTACT.fields.privacyNote.split(privacyLinkText);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const body = new URLSearchParams();
    new FormData(form).forEach((value, name) => {
      if (typeof value === "string") body.append(name, value);
    });

    setState("sending");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error("Netlify form submission failed");
      setState("sent");
    } catch {
      setState("error");
    }
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
              <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 stretch font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.6rem,5.5vw,4.8rem)]">
                {CONTACT.titleLead}
                <br />
                co <span className="text-accent">{CONTACT.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mute">
                {CONTACT.descriptionStart}
                <span className="text-paper">{CONTACT.descriptionHighlight}</span>{CONTACT.descriptionEnd}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Chip className="border-leaf/30 text-leaf">
                  <span className="size-1.5 animate-blink rounded-full bg-leaf" />
                  {CONTACT.availability} {nextMonth}
                </Chip>
                <Chip>{CONTACT.firstDraft}</Chip>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-col gap-2">
                <a
                  href={`tel:${SITE.phoneLink}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-accent p-6 text-ink transition-all duration-300 hover:bg-flame"
                >
                  <span className="relative z-10">
                    <span className="flex items-center gap-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] opacity-80">
                      <span className="relative flex size-2">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-ink opacity-60" />
                        <span className="relative size-2 rounded-full bg-ink" />
                      </span>
                      {SITE.openingHours}
                    </span>
                    <span className="stretch mt-1 block text-3xl font-black tracking-tight md:text-4xl">
                      {SITE.phone}
                    </span>
                  </span>
                  <span className="relative z-10 grid size-14 place-items-center rounded-full bg-ink text-accent transition-transform duration-500 group-hover:rotate-12">
                    <Phone className="size-6" fill="currentColor" />
                  </span>
                </a>

                <div className="grid gap-2 sm:grid-cols-2">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-card p-5 transition-colors duration-300 hover:border-accent/50"
                  >
                    <Mail className="size-5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{CONTACT.emailLabel}</span>
                      <span className="text-[14.5px] font-bold">{SITE.email}</span>
                    </span>
                  </a>
                  <div className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-card p-5">
                    <MapPin className="size-5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{CONTACT.locationLabel}</span>
                      <span className="text-[14.5px] font-bold">{SITE.contactLocation}</span>
                    </span>
                  </div>
                </div>

                <p className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                  <Clock className="size-3.5" />
                  {CONTACT.callNote}
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
                    <h3 className="mt-7 stretch text-3xl font-extrabold tracking-tight">{CONTACT.successTitle}</h3>
                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mute">
                      {CONTACT.successStart}{" "}
                      <a href={`tel:${SITE.phoneLink}`} className="font-bold text-accent">
                        {SITE.phone}
                      </a>
                      .
                    </p>
                  </motion.div>
                ) : (
                  <form
                    name="poptavka"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={onSubmit}
                    className="flex flex-col gap-5"
                  >
                    <input type="hidden" name="form-name" value="poptavka" />
                    <div className="hidden" aria-hidden="true">
                      <label>
                        Nevyplňujte toto pole: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="stretch text-2xl font-extrabold tracking-tight">{CONTACT.formTitle}</h3>
                      <Chip className="hidden sm:inline-flex">{CONTACT.formDuration}</Chip>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          {CONTACT.fields.name}
                        </span>
                        <input required name="jmeno" placeholder={CONTACT.fields.namePlaceholder} className={inputCls} />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          {CONTACT.fields.phone}
                        </span>
                        <input
                          required
                          name="telefon"
                          type="tel"
                          placeholder={CONTACT.fields.phonePlaceholder}
                          className={inputCls}
                        />
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          {CONTACT.fields.email}
                        </span>
                        <input name="email" type="email" placeholder={CONTACT.fields.emailPlaceholder} className={inputCls} />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          {CONTACT.fields.trade}
                        </span>
                        <select required name="obor" className={inputCls} defaultValue="">
                          <option value="" disabled>
                            {CONTACT.fields.tradePlaceholder}
                          </option>
                          {CONTACT.trades.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                          {CONTACT.fields.message}
                      </span>
                      <textarea
                        required
                        name="zprava"
                        rows={4}
                        placeholder={CONTACT.fields.messagePlaceholder}
                        className={`${inputCls} resize-none`}
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group mt-2 flex items-center justify-center gap-2.5 rounded-full bg-accent py-4.5 text-[16px] font-bold tracking-tight text-ink transition-all duration-300 hover:bg-flame hover:shadow-[0_0_44px_-8px_var(--color-accent)] disabled:opacity-70"
                    >
                      {state === "sending" ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          {CONTACT.fields.sending}
                        </>
                      ) : (
                        <>
                          {CONTACT.fields.submit}
                          <Send className="size-4.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs leading-relaxed text-mute">
                      {privacyNoteParts[0]}
                      <a
                        href="/ochrana-osobnich-udaju.html"
                        target="_blank"
                        rel="noopener"
                        className="underline underline-offset-4 transition-colors hover:text-accent"
                      >
                        {privacyLinkText}
                      </a>
                      {privacyNoteParts[1]}
                    </p>
                    {state === "error" && (
                      <p role="alert" className="text-center text-sm text-blood">
                        Odeslání se nepodařilo. Zkuste to znovu, nebo nám zavolejte.
                      </p>
                    )}
                    <p className="flex items-center justify-center gap-2 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute">
                      <ArrowRight className="size-3.5 text-accent" />
                      {CONTACT.fields.response}
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
