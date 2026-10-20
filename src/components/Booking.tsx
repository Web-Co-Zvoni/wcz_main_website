import { useEffect, useRef, useState } from "react";
import { BOOKING } from "../content";
import { Reveal, SectionHead } from "./ui";

/** where the booking system runs, e.g. https://rezervace.webcozvoni.cz (local: http://localhost:3000) */
const BOOKING_URL = import.meta.env.VITE_REZERVACE_URL?.replace(/\/+$/, "");

/**
 * Is the booking system up and does it know this business? Asked once in the browser, so the
 * section only shows when the form can actually load — not while the system isn't deployed
 * yet, and not when it's down. Prerendered HTML never has it (no effects at build time).
 */
function useBookingAvailable(tenant: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!BOOKING_URL) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    fetch(`${BOOKING_URL}/api/public/${encodeURIComponent(tenant)}`, { signal: ctrl.signal })
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [tenant]);
  return ok;
}

/**
 * The booking form of our booking system, in an iframe — the same thing its embed.js does, written
 * for React so it mounts and unmounts with the page. The form reports its height and the iframe
 * follows it, so it never gets a scrollbar of its own. Colours and font are set in the booking
 * system (Nastavení → Vzhled formuláře), its CSS can't be reached from here.
 * The booking origin must be allowed in frame-src and connect-src of public/_headers.
 */
export function BookingFrame({ tenant, title }: { tenant: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!BOOKING_URL) return;
    const origin = new URL(BOOKING_URL).origin;
    const onMessage = (e: MessageEvent) => {
      const el = frame.current;
      if (!el || e.origin !== origin || e.source !== el.contentWindow) return;
      const d = e.data as { type?: string; slug?: string; height?: number } | null;
      if (d?.type !== "rezervace:height" || d.slug !== tenant || typeof d.height !== "number") return;
      el.style.height = `${Math.ceil(d.height)}px`;
      // the minimum only holds until the form loads; then the iframe follows it, shrinking too
      el.style.minHeight = "0";
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [tenant]);

  if (!BOOKING_URL) return null;
  return (
    <iframe
      ref={frame}
      src={`${BOOKING_URL}/b/${encodeURIComponent(tenant)}?embed=1&theme=dark`}
      title={title}
      loading="lazy"
      className="block min-h-[420px] w-full border-0 bg-transparent"
    />
  );
}

/** a slot with Matěj, booked straight from the page — beside the enquiry form, not instead of it */
export default function Booking() {
  const available = useBookingAvailable(BOOKING.tenant);
  if (!available) return null;
  return (
    <section id="konzultace" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={BOOKING.kicker} title={BOOKING.title} desc={BOOKING.description} />
        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-[2rem] border border-paper/10 bg-[#0b0a0c] p-4 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)] md:p-8">
            <BookingFrame tenant={BOOKING.tenant} title={BOOKING.frameTitle} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
