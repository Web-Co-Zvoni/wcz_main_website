import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { CONTACT, SITE } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { EASE, Reveal } from "./ui";

const inputCls =
  "w-full rounded-2xl border border-paper/12 bg-ink/70 px-4.5 py-4 text-[16px] text-paper placeholder:text-mute/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-paper/22 focus:border-accent/70 focus:bg-ink focus:shadow-[0_0_0_4px_rgba(255,59,71,0.14)]";
const labelCls = "text-[14px] font-medium text-paper/70";

export default function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trade, setTrade] = useState("");
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
    <section id="kontakt" className="relative overflow-hidden pb-28 pt-24 md:pb-40 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-[10%] h-[720px] w-[min(1100px,90vw)] bg-[radial-gradient(ellipse_50%_50%_at_40%_40%,rgba(255,59,71,0.14),transparent)]"
      />

      <div className="relative mx-auto grid max-w-[88rem] gap-16 px-4 md:grid-cols-12 md:gap-10 md:px-8">
        {/* the phone first: it's the fastest way in */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[clamp(120px,16vh,160px)]">
            <Reveal>
              <h2 className="display max-w-[10ch] text-[clamp(2.8rem,5.6vw,6.2rem)] leading-[0.96]">{CONTACT.title}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[32ch] text-[clamp(1.1rem,1.4vw,1.4rem)] leading-relaxed text-paper/70">{cz(CONTACT.description)}</p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-12 text-[14.5px] text-mute">{CONTACT.emailLead}</p>
              {/* e-mail as the second way in: big, but quieter than the form */}
              <motion.a
                href={`mailto:${SITE.email}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="group relative mt-3 inline-flex items-center gap-5 rounded-[22px] border border-paper/12 bg-coal/80 py-4 pl-4 pr-6 text-paper transition-colors duration-300 hover:border-accent/50"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-signal text-white shadow-[0_10px_30px_-10px_rgba(255,59,71,0.9)]">
                  <Mail className="size-6" />
                </span>
                <span className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-bold tracking-tight">{SITE.email}</span>
                <ArrowUpRight className="size-5 text-mute transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </motion.a>

              <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-volt/25 bg-volt/[0.06] px-4 py-2 text-[13.5px] text-volt">
                <span className="size-1.5 animate-signal rounded-full bg-volt" />
                {CONTACT.availability} {nextMonth}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="md:col-span-7">
          <div className="relative overflow-hidden rounded-[32px] border border-paper/10 bg-coal/80 p-6 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] md:p-11">
            <span aria-hidden className="pointer-events-none absolute inset-x-[12%] -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,59,71,0.16),transparent)]"
            />
            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[560px] flex-col items-center justify-center text-center"
                >
                  <span className="relative grid size-20 place-items-center rounded-full bg-volt/10 text-volt">
                    <span className="pulse-ring" />
                    <CheckCircle2 className="size-9" />
                  </span>
                  <h3 className="display mt-7 text-4xl">{CONTACT.successTitle}</h3>
                  <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-mute">
                    {CONTACT.successStart}{" "}
                    <a href={`mailto:${SITE.email}`} className="font-semibold text-accent">
                      {SITE.email}
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                  name="poptavka"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={onSubmit}
                  className="relative flex flex-col gap-6 text-left"
                >
                  <input type="hidden" name="form-name" value="poptavka" />
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Nevyplňujte toto pole: <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <h3 className="display-soft text-[clamp(1.6rem,2.2vw,2.1rem)]">{CONTACT.formTitle}</h3>

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

                  <label className="flex flex-col gap-2">
                    <span className={labelCls}>{CONTACT.fields.email}</span>
                    <input name="email" type="email" autoComplete="email" placeholder={CONTACT.fields.emailPlaceholder} className={inputCls} />
                  </label>

                  {/* trade as tap-to-pick chips — one radio group, same "obor" field the form always sent */}
                  <fieldset className="flex flex-col gap-3">
                    <legend className={cn(labelCls, "mb-3")}>{CONTACT.fields.trade}</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {CONTACT.trades.map((t, i) => {
                        const on = trade === t;
                        return (
                          <label key={t} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="obor"
                              value={t}
                              required={i === 0}
                              checked={on}
                              onChange={() => setTrade(t)}
                              className="peer absolute inset-0 cursor-pointer opacity-0"
                            />
                            <span
                              className={cn(
                                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14.5px] transition-[background-color,border-color,color,box-shadow] duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                                on
                                  ? "border-signal bg-signal text-white shadow-[0_8px_24px_-10px_rgba(255,59,71,0.9)]"
                                  : "border-paper/12 bg-ink/50 text-paper/80 hover:border-paper/30 hover:text-paper"
                              )}
                            >
                              <AnimatePresence initial={false}>
                                {on && (
                                  <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: EASE }}
                                    className="overflow-hidden"
                                  >
                                    <Check className="size-3.5" strokeWidth={3} />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                              {t}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="flex flex-col gap-2">
                    <span className={labelCls}>{CONTACT.fields.message}</span>
                    <textarea required name="zprava" rows={4} placeholder={CONTACT.fields.messagePlaceholder} className={`${inputCls} resize-none`} />
                  </label>

                  <motion.button
                    type="submit"
                    disabled={state === "sending"}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative mt-1 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-signal py-5 text-[17px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,59,71,0.5),0_16px_50px_-14px_rgba(255,59,71,0.9)] transition-colors duration-300 hover:bg-accent disabled:opacity-70"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shine_0.9s_ease]"
                    />
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
                  <p className="text-center text-[13px] leading-relaxed text-mute">
                    {privacyNoteParts[0]}
                    <a href="/ochrana-osobnich-udaju.html" target="_blank" rel="noopener" className="underline underline-offset-4 transition-colors hover:text-accent">
                      {privacyLinkText}
                    </a>
                    {privacyNoteParts[1]}
                  </p>
                  {state === "error" && (
                    <p role="alert" className="text-center text-[14px] text-accent">
                      {CONTACT.fields.error}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
