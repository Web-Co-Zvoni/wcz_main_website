import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Loader2, RotateCcw, Video } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { CONTACT } from "../content";
import { ApiError, dayParts, getInfo, getSlots, type Info, type Slot } from "../lib/rezervace";
import { cn } from "../utils/cn";
import { EASE } from "./ui";

export type Pick = { serviceId: string; date: string; slot: Slot };

const COPY = CONTACT.calendar;
// on opening, look this many days ahead for the first one with a free time, so the picker never opens on a full day
const LOOK_AHEAD = 7;

/** the system's own message only when it helps the visitor ("too many requests"); otherwise a plain "couldn't load" */
const failure = (e: unknown) => (e instanceof ApiError && e.code === "RATE_LIMITED" ? e.message : COPY.loadError);

const chipCls =
  "rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const chipOff = "border-paper/12 bg-ink/50 text-paper/80 hover:border-paper/30 hover:text-paper";
const chipOn = "border-signal bg-signal text-white";

/** The form's last step: a row of days, then the free times of the chosen day, straight from the booking system */
export default function MeetingSlots({
  day,
  value,
  onChange,
  fallback,
  onUnavailable,
}: {
  /** a day to open on instead of looking for the first free one */
  day: string | null;
  value: Pick | null;
  onChange: (pick: Pick | null) => void;
  /** a way out when there's no calendar to pick from — the answers still reach us */
  fallback: ReactNode;
  /** told whenever the calendar stops or starts being there, so the form can hide its "book" button meanwhile */
  onUnavailable: (unavailable: boolean) => void;
}) {
  const [info, setInfo] = useState<Info | null>(null);
  const [date, setDate] = useState<string | null>(value?.date ?? day);
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const service = info?.services[0];
  const unavailable = error !== null || (info !== null && (!service || !info.dates.length));

  useEffect(() => onUnavailable(unavailable), [unavailable, onUnavailable]);

  // the meeting type and its days, then the first day that still has a free time
  useEffect(() => {
    const ctrl = new AbortController();
    setError(null);
    (async () => {
      const i = await getInfo();
      setInfo(i);
      const s = i.services[0];
      if (!s || date) return;
      for (const d of i.dates.slice(0, LOOK_AHEAD)) {
        const free = await getSlots(s.id, d, ctrl.signal);
        setSlots((prev) => ({ ...prev, [d]: free }));
        if (free.length) return setDate(d);
      }
      setDate(i.dates[0] ?? null);
    })().catch((e) => {
      if (!ctrl.signal.aborted) setError(failure(e));
    });
    return () => ctrl.abort();
    // `date` only decides whether to look ahead, so it's left out on purpose
  }, [attempt]);

  // times of a day picked by hand
  useEffect(() => {
    if (!service || !date || slots[date]) return;
    const ctrl = new AbortController();
    setError(null);
    getSlots(service.id, date, ctrl.signal)
      .then((free) => setSlots((prev) => ({ ...prev, [date]: free })))
      .catch((e) => {
        if (!ctrl.signal.aborted) setError(failure(e));
      });
    return () => ctrl.abort();
  }, [service, date, slots, attempt]);

  const retry = () => {
    setSlots({});
    onChange(null);
    setAttempt((a) => a + 1);
  };

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-paper/10 bg-ink/50 px-6 py-10 text-center">
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-paper/80">{error}</p>
        <button type="button" onClick={retry} className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-accent">
          <RotateCcw className="size-4" />
          {COPY.retry}
        </button>
        {fallback}
      </div>
    );
  }

  if (!info) return <Loading />;

  if (!service || !info.dates.length) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-paper/10 bg-ink/50 px-6 py-10 text-center">
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-mute">{COPY.noDates}</p>
        {fallback}
      </div>
    );
  }

  const daySlots = date ? slots[date] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <p className="flex items-center gap-3 text-[0.9375rem] text-paper/80">
        <span className="grid size-9 place-items-center rounded-xl bg-signal/15 text-accent">
          <Video className="size-[1.125rem]" />
        </span>
        <span>
          <span className="font-semibold text-paper">{service.name}</span> · {service.durationMin} min
          {service.description && <span className="block text-[0.8438rem] text-mute">{service.description}</span>}
        </span>
      </p>

      {/* min-w-0: a fieldset is as wide as its content by default, and the row of days would stretch the whole form */}
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-3 text-[0.875rem] font-medium text-paper/70">{COPY.day}</legend>
        {/* a swipeable row: the page itself never scrolls sideways */}
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {info.dates.map((d) => {
            const on = d === date;
            const full = slots[d]?.length === 0;
            const p = dayParts(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setDate(d);
                  if (value?.date !== d) onChange(null);
                }}
                className={cn(chipCls, "flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center px-3 py-2.5", on ? chipOn : chipOff, full && !on && "opacity-45")}
              >
                <span className="text-[0.75rem] uppercase tracking-wide opacity-80">{p.short}</span>
                <span className="text-[0.9375rem] font-semibold tabular-nums">{p.date}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex min-h-[9.5rem] min-w-0 flex-col gap-3">
        <legend className="mb-3 text-[0.875rem] font-medium text-paper/70">{COPY.time}</legend>
        <AnimatePresence mode="wait" initial={false}>
          {!daySlots ? (
            <Loading key="loading" />
          ) : daySlots.length === 0 ? (
            <motion.p
              key={`full-${date}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-ink/50 px-5 py-6 text-[0.9375rem] text-mute"
            >
              <CalendarX2 className="size-5 shrink-0" />
              {COPY.dayFull}
            </motion.p>
          ) : (
            <motion.div
              key={`slots-${date}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid grid-cols-3 gap-2.5 sm:grid-cols-4"
            >
              {daySlots.map((s) => {
                const on = value?.slot.start === s.start;
                return (
                  <button
                    key={s.start}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onChange({ serviceId: service.id, date: date!, slot: s })}
                    className={cn(chipCls, "py-3 text-[0.9375rem] font-semibold tabular-nums", on ? chipOn : chipOff)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </fieldset>
    </div>
  );
}

function Loading() {
  return (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3 py-10 text-[0.9375rem] text-mute">
      <Loader2 className="size-5 animate-spin" />
      {COPY.loading}
    </motion.p>
  );
}
