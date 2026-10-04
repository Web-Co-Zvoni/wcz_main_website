import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { CONTACT, SITE } from "../content";
import ChargedLogo from "./ChargedLogo";
import bellSvg from "../assets/brand/bell.svg";
import { Kicker, Reveal } from "./ui";
import { cz } from "../utils/typo";

const inputCls =
  "w-full rounded-xl border border-paper/12 bg-ink/80 px-4 py-3.5 text-[15px] text-paper placeholder:text-mute/55 outline-none transition-[border-color,box-shadow] duration-300 focus:border-accent/70 focus:shadow-[0_0_0_4px_rgba(255,214,10,0.14)]";
const labelCls = "text-[13px] font-medium text-mute";

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
    <section id="kontakt" className="relative overflow-hidden px-4 pb-24 pt-16 md:pb-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[640px] w-[min(1000px,100vw)] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_45%_at_50%_30%,rgba(255,214,10,0.16),transparent)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal y={20}>
          <ChargedLogo src={bellSvg} scale={0.7} className="relative size-[min(320px,72vw)] cursor-pointer" />
          <p className="-mt-2 text-[12.5px] text-mute/70">{CONTACT.bellHint}</p>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <Kicker>{CONTACT.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-5 text-[clamp(2.1rem,5.6vw,4.4rem)]">{CONTACT.title}</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-md text-[16.5px] leading-relaxed text-mute">{cz(CONTACT.description)}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <motion.a
              href={`tel:${SITE.phoneLink}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-4 rounded-2xl bg-signal py-4 pl-4 pr-7 text-ink shadow-[0_0_0_1px_rgba(255,214,10,0.6),0_20px_60px_-15px_rgba(255,214,10,0.9)] transition-colors hover:bg-accent"
            >
              <span className="relative grid size-12 place-items-center rounded-xl bg-ink text-signal">
                <span className="pulse-ring" />
                <Phone className="animate-ringshake size-5" fill="currentColor" />
              </span>
              <span className="flex flex-col items-start">
                <span className="text-[12.5px] font-medium opacity-85">{SITE.openingHours}</span>
                <span className="text-[30px] font-bold tabular-nums leading-none tracking-tight">{SITE.phone}</span>
              </span>
            </motion.a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-[15px] font-medium text-paper/85 transition-colors hover:text-accent">
              <Mail className="size-4 text-accent" />
              {SITE.email}
            </a>
            <p className="inline-flex items-center gap-2 rounded-full border border-volt/25 bg-volt/[0.06] px-3.5 py-1.5 text-[12.5px] text-volt">
              <span className="size-1.5 animate-signal rounded-full bg-volt" />
              {CONTACT.availability} {nextMonth}
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="relative mx-auto mt-20 max-w-2xl">
        <div className="relative rounded-[24px] border border-paper/10 bg-coal/80 p-6 backdrop-blur md:p-10">
          <span aria-hidden className="pointer-events-none absolute inset-x-[20%] -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          {state === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[420px] flex-col items-center justify-center text-center"
            >
              <span className="relative grid size-20 place-items-center rounded-full bg-volt/10 text-volt">
                <span className="pulse-ring" />
                <CheckCircle2 className="size-9" />
              </span>
              <h3 className="display mt-7 text-4xl">{CONTACT.successTitle}</h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mute">
                {CONTACT.successStart}{" "}
                <a href={`tel:${SITE.phoneLink}`} className="font-semibold text-accent">
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
              className="flex flex-col gap-5 text-left"
            >
              <input type="hidden" name="form-name" value="poptavka" />
              <div className="hidden" aria-hidden="true">
                <label>
                  Nevyplňujte toto pole: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <h3 className="display-soft text-center text-[28px]">{CONTACT.formTitle}</h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelCls}>{CONTACT.fields.name}</span>
                  <input required name="jmeno" autoComplete="name" placeholder={CONTACT.fields.namePlaceholder} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelCls}>{CONTACT.fields.phone}</span>
                  <input required name="telefon" type="tel" autoComplete="tel" placeholder={CONTACT.fields.phonePlaceholder} className={inputCls} />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelCls}>{CONTACT.fields.email}</span>
                  <input name="email" type="email" autoComplete="email" placeholder={CONTACT.fields.emailPlaceholder} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelCls}>{CONTACT.fields.trade}</span>
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
                <span className={labelCls}>{CONTACT.fields.message}</span>
                <textarea required name="zprava" rows={4} placeholder={CONTACT.fields.messagePlaceholder} className={`${inputCls} resize-none`} />
              </label>

              <motion.button
                type="submit"
                disabled={state === "sending"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-2 flex items-center justify-center gap-2.5 rounded-xl bg-signal py-4 text-[16px] font-semibold text-ink shadow-[0_0_0_1px_rgba(255,214,10,0.5),0_12px_44px_-12px_rgba(255,214,10,0.9)] transition-colors duration-300 hover:bg-accent disabled:opacity-70"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    {CONTACT.fields.sending}
                  </>
                ) : (
                  <>
                    {CONTACT.fields.submit}
                    <Send className="size-4.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" strokeWidth={2.5} />
                  </>
                )}
              </motion.button>
              <p className="text-center text-[12.5px] leading-relaxed text-mute">
                {privacyNoteParts[0]}
                <a href="/ochrana-osobnich-udaju.html" target="_blank" rel="noopener" className="underline underline-offset-4 transition-colors hover:text-accent">
                  {privacyLinkText}
                </a>
                {privacyNoteParts[1]}
              </p>
              {state === "error" && (
                <p role="alert" className="text-center text-sm text-accent">
                  {CONTACT.fields.error}
                </p>
              )}
              <p className="text-center text-[12.5px] text-mute/70">{CONTACT.callNote}</p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
