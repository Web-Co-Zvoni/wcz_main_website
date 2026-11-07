import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, AtSign, Building2, CalendarCheck, Check, CheckCircle2, Globe, Loader2, Mail, MessageSquareText, Phone, Send, UserRound, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CONTACT, SETTINGS, SITE } from "../content";
import { ApiError, dayLabel, getInfo, requestMeeting } from "../lib/rezervace";
import { jumpTo } from "../lib/scroll";
import { useHydrated } from "../lib/useHydrated";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import MeetingSlots, { type Pick } from "./MeetingSlots";
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

/** tap-to-pick answers: one radio group dressed as chips */
function Chips({ legend, name, options, value, onChange }: { legend: string; name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={cn(labelCls, "mb-3")}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((t, i) => {
          const on = value === t;
          return (
            <label key={t} className="relative cursor-pointer">
              <input
                type="radio"
                name={name}
                value={t}
                required={i === 0}
                checked={on}
                onChange={() => onChange(t)}
                className="peer absolute inset-0 cursor-pointer opacity-0"
              />
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.9062rem] transition-[background-color,border-color,color,box-shadow] duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                  on ? "border-signal bg-signal text-white" : "border-paper/12 bg-ink/50 text-paper/80 hover:border-paper/30 hover:text-paper"
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
  );
}

const STEPS = CONTACT.steps.length;
const LAST = STEPS - 1;
// the same rule the booking system checks the phone against
const PHONE_PATTERN = "\\+?[0-9 \\(\\)\\-]{9,}";

// Web3Forms access keys are public by design — they only say which inbox a submission goes to.
// Only used when the calendar can't be reached, so nobody who filled the form in is lost.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "9008155c-c8fe-4d24-b37a-6d9dbf91870e";

/**
 * One form in three steps: contact details, a couple of questions about the web, then a time
 * for a video call from our booking system (src/lib/rezervace.ts).
 * `trade` pre-picks the "Čím se živíte?" chip — on a trade or concept page we already know it.
 * `pinned` keeps the heading column stuck beside the form while it scrolls (the home page);
 * without it the column sits centred next to the form.
 */
export default function Contact({ trade: knownTrade, pinned = true }: { trade?: string; pinned?: boolean } = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "booked" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState(knownTrade ?? "");
  const [need, setNeed] = useState("");
  const [filled, setFilled] = useState({ jmeno: false, firma: false, telefon: false, email: false });
  // the link to the website to be redone: kept here, so it survives switching the chip away and back
  const [oldWeb, setOldWeb] = useState("");
  const redo = need === CONTACT.redoNeed;
  const [pick, setPick] = useState<Pick | null>(null);
  // the last day a time was picked on, so a reload of the picker stays there
  const [day, setDay] = useState<string | null>(null);
  // bumped when the picked time was taken meanwhile, so the picker loads the day afresh
  const [slotsKey, setSlotsKey] = useState(0);
  // no calendar to pick from: only "send without a time" is left, the book button goes
  const [noCalendar, setNoCalendar] = useState(false);
  // one per filled-in form, so a double click doesn't book twice
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  // whether what this step asks for is there — lights up the button
  const ready = [filled.jmeno && filled.telefon && filled.email, trade !== "" && need !== "" && (!redo || oldWeb.trim() !== ""), pick !== null][step];
  // the prerendered HTML carries the build date; the browser swaps in today once it has taken the page over
  const today = useHydrated() ? new Date() : new Date(__BUILD_TIME__);
  const nextMonth = CONTACT.monthsGenitive[(today.getMonth() + 1) % 12];
  const privacyLinkText = "jak nakládáme s vašimi údaji";
  const privacyNoteParts = CONTACT.fields.privacyNote.split(privacyLinkText);

  const goTo = (next: number) => {
    setStep(next);
    setError(null);
    // a step can be much shorter than the last one: bring the form's top back into view
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) jumpTo(top + window.scrollY + SETTINGS.smoothScrollOffset);
  };

  const answers = () => {
    const data: Record<string, string> = {};
    if (formRef.current)
      new FormData(formRef.current).forEach((value, name) => {
        if (typeof value === "string") data[name] = value;
      });
    return data;
  };

  /** when there's no calendar to pick from, the answers come to our inbox like the old inquiry form */
  const sendWithoutTime = async () => {
    const data = answers();
    setState("sending");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nová poptávka z webu (bez termínu) — ${data.obor ?? ""}`.trim(),
          from_name: SITE.domain,
          // lets "reply" in the inbox go straight to the customer
          replyto: data.email,
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || !result?.success) throw new Error("Web3Forms submission failed");
      setState("sent");
    } catch {
      setState("idle");
      setError(CONTACT.fields.fallbackError);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // only this step's fields: the later ones are still empty, the earlier ones only hidden
    const fields = e.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-step="${step}"] :is(input, textarea)`);
    const invalid = Array.from(fields).find((f) => !f.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }

    if (step < LAST) {
      // warm up the calendar while the next questions are being answered
      if (step === 0) getInfo().catch(() => {});
      goTo(step + 1);
      return;
    }
    if (!pick) {
      setError(CONTACT.fields.pickFirst);
      return;
    }

    const data = answers();
    setError(null);
    setState("sending");
    try {
      await requestMeeting({
        serviceId: pick.serviceId,
        start: pick.slot.start,
        name: data.jmeno ?? "",
        email: data.email ?? "",
        phone: data.telefon ?? "",
        vehicle: data.obor ?? "",
        // the booking has no field for the company or the old website: they go into the note
        note: [
          `Chce: ${data.potreba ?? ""}`,
          data.firma?.trim() && `Firma: ${data.firma.trim()}`,
          data.web?.trim() && `Současný web: ${data.web.trim()}`,
          data.poznamka?.trim(),
        ]
          .filter(Boolean)
          .join("\n"),
        idempotencyKey,
      });
      setState("booked");
    } catch (err) {
      setState("idle");
      setError(err instanceof ApiError ? err.message : CONTACT.fields.error);
      // someone else was quicker: show that day's times again, without the lost one
      if (err instanceof ApiError && (err.code === "SLOT_TAKEN" || err.code === "INVALID_SLOT")) {
        setPick(null);
        setSlotsKey((k) => k + 1);
      }
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

        {/* min-w-0: a grid column grows to its content by default, and the calendar's row of days is wide */}
        <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
          <div className="relative rounded-[2rem] border border-paper/10 bg-[#0b0a0c] p-6 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] md:p-11">
            {/* two lights circling the frame in opposite directions */}
            <span className="duo-ring" aria-hidden />
            <span className="duo-ring duo-ring--reverse" aria-hidden />
            {/* a faint dot grid fading in from the top corner */}
            <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
              <span className="absolute inset-0 bg-[radial-gradient(rgba(244,239,236,0.09)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,#000,transparent)]" />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              {state === "booked" || state === "sent" ? (
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
                  <h3 className="display mt-7 text-4xl">{state === "booked" ? CONTACT.successTitle : CONTACT.fallbackTitle}</h3>
                  {state === "booked" && pick && (
                    <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-paper/12 bg-ink/60 px-5 py-2.5 text-[1rem] font-semibold text-paper">
                      <CalendarCheck className="size-[1.125rem] text-volt" />
                      <span className="first-letter:uppercase">{dayLabel(pick.date)}</span> v {pick.slot.label}
                    </p>
                  )}
                  <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-mute">
                    {state === "booked" ? CONTACT.successText : CONTACT.fallbackText}{" "}
                    <a href={`mailto:${SITE.email}`} className="font-semibold text-accent">
                      {SITE.email}
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                  name="poptavka"
                  method="POST"
                  noValidate
                  onSubmit={onSubmit}
                  onInput={(e) => {
                    const fd = new FormData(e.currentTarget);
                    const has = (n: string) => String(fd.get(n) ?? "").trim() !== "";
                    setFilled({ jmeno: has("jmeno"), firma: has("firma"), telefon: has("telefon"), email: has("email") });
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
                    {/* where in the three steps we are */}
                    <div className="flex flex-col items-end gap-2 max-md:items-center" aria-live="polite">
                      <span className="text-[0.8125rem] tabular-nums text-mute">{CONTACT.stepLabel(step + 1, STEPS, CONTACT.steps[step])}</span>
                      <span className="flex gap-1.5" aria-hidden>
                        {CONTACT.steps.map((s, i) => (
                          <span key={s} className="h-1.5 w-12 overflow-hidden rounded-full bg-paper/10">
                            <motion.span
                              className={cn("block h-full origin-left rounded-full", i < step ? "bg-volt" : "bg-accent")}
                              initial={false}
                              animate={{ scaleX: i <= step ? 1 : 0 }}
                              transition={{ duration: 0.5, ease: EASE }}
                            />
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>

                  {/* earlier steps only hide, so "back" finds them filled in and they still go with the request */}
                  <div data-step={0} className={cn("flex flex-col gap-6", step !== 0 && "hidden")}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={CONTACT.fields.name} icon={UserRound} done={filled.jmeno}>
                        <input required name="jmeno" autoComplete="name" placeholder={CONTACT.fields.namePlaceholder} className={inputCls} />
                      </Field>
                      <Field label={CONTACT.fields.company} icon={Building2} done={filled.firma}>
                        <input name="firma" autoComplete="organization" maxLength={100} placeholder={CONTACT.fields.companyPlaceholder} className={inputCls} />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={CONTACT.fields.phone} icon={Phone} done={filled.telefon}>
                        <input
                          required
                          name="telefon"
                          type="tel"
                          autoComplete="tel"
                          pattern={PHONE_PATTERN}
                          placeholder={CONTACT.fields.phonePlaceholder}
                          className={inputCls}
                        />
                      </Field>
                      <Field label={CONTACT.fields.email} icon={AtSign} done={filled.email}>
                        <input required name="email" type="email" autoComplete="email" placeholder={CONTACT.fields.emailPlaceholder} className={inputCls} />
                      </Field>
                    </div>
                  </div>

                  <div data-step={1} className={cn("flex flex-col gap-6", step !== 1 && "hidden")}>
                    <Chips legend={CONTACT.fields.trade} name="obor" options={CONTACT.trades} value={trade} onChange={setTrade} />
                    <Chips legend={CONTACT.fields.need} name="potreba" options={CONTACT.needs} value={need} onChange={setNeed} />
                    {/* redoing a website: we need to see the current one. -m-1 p-1 leaves room for the focus ring the overflow would clip */}
                    <AnimatePresence initial={false}>
                      {redo && (
                        <motion.div
                          key="old-web"
                          initial={{ height: 0, opacity: 0, marginTop: "-1.75rem" }}
                          animate={{ height: "auto", opacity: 1, marginTop: "-0.25rem" }}
                          exit={{ height: 0, opacity: 0, marginTop: "-1.75rem" }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="-m-1 overflow-hidden p-1"
                        >
                          <Field label={CONTACT.fields.oldWeb} icon={Globe} done={oldWeb.trim() !== ""}>
                            <input
                              required
                              autoFocus
                              name="web"
                              inputMode="url"
                              autoComplete="url"
                              maxLength={200}
                              value={oldWeb}
                              onChange={(e) => setOldWeb(e.target.value)}
                              placeholder={CONTACT.fields.oldWebPlaceholder}
                              className={inputCls}
                            />
                          </Field>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Field label={CONTACT.fields.note} icon={MessageSquareText} done={false}>
                      <textarea name="poznamka" rows={3} maxLength={600} placeholder={CONTACT.fields.notePlaceholder} className={`${inputCls} block resize-none`} />
                    </Field>
                  </div>

                  {step === LAST && (
                    <MeetingSlots
                      key={slotsKey}
                      day={day}
                      value={pick}
                      onChange={(p) => {
                        setPick(p);
                        if (p) setDay(p.date);
                        setError(null);
                      }}
                      onUnavailable={setNoCalendar}
                      fallback={
                        <button
                          type="button"
                          onClick={sendWithoutTime}
                          disabled={state === "sending"}
                          className="inline-flex items-center gap-2 rounded-2xl bg-signal px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors duration-300 hover:bg-accent disabled:opacity-70"
                        >
                          {state === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                          {CONTACT.calendar.sendWithout}
                        </button>
                      }
                    />
                  )}

                  <div className="mt-1 flex gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => goTo(step - 1)}
                        className="flex items-center gap-2 rounded-2xl border border-paper/12 px-5 py-4 text-[0.9375rem] font-semibold text-paper/80 transition-colors duration-300 hover:border-paper/30 hover:text-paper"
                      >
                        <ArrowLeft className="size-4" />
                        {CONTACT.fields.back}
                      </button>
                    )}
                    {!(step === LAST && noCalendar) && (
                      <motion.button
                        type="submit"
                        disabled={state === "sending"}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-signal py-5 text-[1.0625rem] font-semibold text-white transition-colors duration-300 hover:bg-accent disabled:opacity-70",
                          ready && "bg-accent"
                        )}
                      >
                        {/* once the step is complete, a light starts running round the button */}
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
                        ) : step === LAST ? (
                          <>
                            {CONTACT.fields.submit}
                            <CalendarCheck className="size-4.5" strokeWidth={2.5} />
                          </>
                        ) : (
                          <>
                            {CONTACT.fields.next}
                            <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                  <p className="text-center text-[0.8125rem] leading-relaxed text-mute">
                    {privacyNoteParts[0]}
                    <a href="/ochrana-osobnich-udaju.html" target="_blank" rel="noopener" className="underline underline-offset-4 transition-colors hover:text-accent">
                      {privacyLinkText}
                    </a>
                    {privacyNoteParts[1]}
                  </p>
                  {error && (
                    <p role="alert" className="text-center text-[0.875rem] text-accent">
                      {error}
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
