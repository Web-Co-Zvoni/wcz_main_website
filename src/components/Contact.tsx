import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, AtSign, Check, CheckCircle2, Loader2, Mail, MessageSquareText, Phone, Send, UserRound, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CONTACT, SITE } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { EASE, Reveal, ShineBorder } from "./ui";

const inputCls =
  "w-full rounded-2xl border border-paper/12 bg-ink/70 py-4 pl-12 pr-11 text-[1rem] text-paper placeholder:text-mute/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-paper/22 focus:border-accent/70 focus:bg-ink focus:shadow-[0_0_0_4px_rgba(255,59,71,0.14)]";
const labelCls = "text-[0.875rem] font-medium text-paper/70";

/** a labelled input with its icon, which lights up on focus, and a tick once it has a value */
function Field({ label, icon: Icon, done, children }: { label: string; icon: LucideIcon; done: boolean; children: ReactNode }) {
  return (
    <label className="group/field flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-[1.15rem] size-[1.125rem] text-mute/60 transition-colors duration-300 group-focus-within/field:text-accent" />
        {children}
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 22 }}
              className="pointer-events-none absolute right-4 top-[1.05rem] grid size-5 place-items-center rounded-full bg-volt/15 text-volt"
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </label>
  );
}

const REQUIRED = 4;

// Web3Forms access keys are public by design — they only say which inbox a submission goes to
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "9008155c-c8fe-4d24-b37a-6d9dbf91870e";

/**
 * `trade` pre-picks the "Čím se živíte?" chip — on a trade or concept page we already know it.
 * `pinned` keeps the heading column stuck beside the form while it scrolls (the home page);
 * without it the column sits centred next to the form.
 */
export default function Contact({ trade: knownTrade, pinned = true }: { trade?: string; pinned?: boolean } = {}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trade, setTrade] = useState(knownTrade ?? "");
  const [filled, setFilled] = useState({ jmeno: false, telefon: false, email: false, zprava: false });
  const done = [filled.jmeno, filled.telefon, trade !== "", filled.zprava].filter(Boolean).length;
  const ready = done === REQUIRED;
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

    const data: Record<string, string> = {};
    new FormData(form).forEach((value, name) => {
      if (typeof value === "string") data[name] = value;
    });

    setState("sending");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nová poptávka z webu — ${data.obor ?? ""}`.trim(),
          from_name: SITE.domain,
          // lets "reply" in the inbox go straight to the customer
          ...(data.email ? { replyto: data.email } : {}),
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !result?.success) throw new Error("Web3Forms submission failed");
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="kontakt" className="relative overflow-hidden pb-28 pt-24 md:pb-40 md:pt-32">
      <div className="relative mx-auto grid max-w-[88rem] gap-16 px-4 md:px-8 lg:grid-cols-12 lg:gap-10">
        {/* the phone first: it's the fastest way in */}
        <div className={cn("lg:col-span-5 max-lg:text-center", !pinned && "lg:self-center")}>
          <div className={cn(pinned && "lg:sticky lg:top-[clamp(7.5rem,16vh,10rem)]")}>
            <Reveal>
              <h2 className="display max-w-[10ch] text-[clamp(2.8rem,5.6vw,6.2rem)] leading-[0.96] max-lg:mx-auto">{CONTACT.title}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[32ch] text-[clamp(1.1rem,1.4vw,1.4rem)] leading-relaxed text-paper/70 max-lg:mx-auto">{cz(CONTACT.description)}</p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-12 text-[0.9062rem] text-mute">{CONTACT.emailLead}</p>
              {/* e-mail as the second way in: big, but quieter than the form */}
              <motion.a
                href={`mailto:${SITE.email}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="group relative mt-3 inline-flex items-center gap-5 rounded-[1.375rem] border border-paper/12 bg-[#0b0a0c]/80 py-4 pl-4 pr-6 text-paper transition-colors duration-300 hover:border-accent/50 max-md:gap-3 max-md:pr-4"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-signal text-white">
                  <Mail className="size-6" />
                </span>
                <span className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-bold tracking-tight">{SITE.email}</span>
                <ArrowUpRight className="size-5 text-mute transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </motion.a>

              <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-volt/25 bg-volt/[0.06] px-4 py-2 text-[0.8438rem] text-volt max-lg:mx-auto max-lg:flex max-lg:w-fit">
                <span className="size-1.5 animate-signal rounded-full bg-volt" />
                {CONTACT.availability} {nextMonth}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative rounded-[2rem] border border-paper/10 bg-[#0b0a0c] p-6 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] md:p-11">
            {/* two lights circling the frame in opposite directions */}
            <span className="duo-ring" aria-hidden />
            <span className="duo-ring duo-ring--reverse" aria-hidden />
            {/* a faint dot grid fading in from the top corner */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <span className="absolute inset-0 bg-[radial-gradient(rgba(244,239,236,0.09)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,#000,transparent)]" />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[35rem] flex-col items-center justify-center text-center"
                >
                  <span className="relative grid size-20 place-items-center rounded-full bg-volt/10 text-volt">
                    <span className="pulse-ring" />
                    <CheckCircle2 className="size-9" />
                  </span>
                  <h3 className="display mt-7 text-4xl">{CONTACT.successTitle}</h3>
                  <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-mute">
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
                  onSubmit={onSubmit}
                  onInput={(e) => {
                    const fd = new FormData(e.currentTarget);
                    const has = (n: string) => String(fd.get(n) ?? "").trim() !== "";
                    setFilled({ jmeno: has("jmeno"), telefon: has("telefon"), email: has("email"), zprava: has("zprava") });
                  }}
                  className="relative flex flex-col gap-6 text-left"
                >
                  {/* Web3Forms honeypot: bots tick it, people never see it */}
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Nevyplňujte toto pole: <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 max-md:flex-col max-md:items-center max-md:text-center">
                    <h3 className="display-soft text-[clamp(1.6rem,2.2vw,2.1rem)]">{CONTACT.formTitle}</h3>
                    {/* how far along the required fields are */}
                    <div className="flex flex-col items-end gap-2 max-md:items-center" aria-live="polite">
                      <span className={cn("text-[0.8125rem] tabular-nums transition-colors duration-500", ready ? "text-volt" : "text-mute")}>
                        {CONTACT.progress(done, REQUIRED)}
                      </span>
                      <span className="flex gap-1.5" aria-hidden>
                        {Array.from({ length: REQUIRED }, (_, i) => (
                          <span key={i} className="h-1.5 w-9 overflow-hidden rounded-full bg-paper/10">
                            <motion.span
                              className={cn("block h-full origin-left rounded-full", ready ? "bg-volt" : "bg-accent")}
                              initial={false}
                              animate={{ scaleX: i < done ? 1 : 0 }}
                              transition={{ duration: 0.5, ease: EASE }}
                            />
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={CONTACT.fields.name} icon={UserRound} done={filled.jmeno}>
                      <input required name="jmeno" autoComplete="name" placeholder={CONTACT.fields.namePlaceholder} className={inputCls} />
                    </Field>
                    <Field label={CONTACT.fields.phone} icon={Phone} done={filled.telefon}>
                      <input required name="telefon" type="tel" autoComplete="tel" placeholder={CONTACT.fields.phonePlaceholder} className={inputCls} />
                    </Field>
                  </div>

                  <Field label={CONTACT.fields.email} icon={AtSign} done={filled.email}>
                    <input name="email" type="email" autoComplete="email" placeholder={CONTACT.fields.emailPlaceholder} className={inputCls} />
                  </Field>

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
                                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.9062rem] transition-[background-color,border-color,color,box-shadow] duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                                on
                                  ? "border-signal bg-signal text-white"
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

                  <Field label={CONTACT.fields.message} icon={MessageSquareText} done={filled.zprava}>
                    <textarea required name="zprava" rows={4} placeholder={CONTACT.fields.messagePlaceholder} className={`${inputCls} block resize-none`} />
                  </Field>

                  <motion.button
                    type="submit"
                    disabled={state === "sending"}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative mt-1 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-signal py-5 text-[1.0625rem] font-semibold text-white transition-colors duration-300 hover:bg-accent disabled:opacity-70",
                      ready && "bg-accent"
                    )}
                  >
                    {/* once everything required is filled, a light starts running round the button */}
                    {ready && <ShineBorder width={1.5} duration={4} />}
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
                  <p className="text-center text-[0.8125rem] leading-relaxed text-mute">
                    {privacyNoteParts[0]}
                    <a href="/ochrana-osobnich-udaju.html" target="_blank" rel="noopener" className="underline underline-offset-4 transition-colors hover:text-accent">
                      {privacyLinkText}
                    </a>
                    {privacyNoteParts[1]}
                  </p>
                  {state === "error" && (
                    <p role="alert" className="text-center text-[0.875rem] text-accent">
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
