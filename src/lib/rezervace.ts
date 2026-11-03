/**
 * Client for our own booking system (rezervacni-system) — its public API, no iframe.
 * The meeting slots, the request and the e-mails all live there; this site only shows them.
 * Nothing here is secret: the URL and the slug end up in the site's JavaScript anyway.
 */

const env = import.meta.env;

export const REZERVACE = {
  // set in `.env.production`; empty = no calendar, the form offers sending without a time instead
  url: (env.VITE_REZERVACE_URL ?? "").replace(/\/+$/, ""),
  /** this business in the booking system (its slug, set in /admin → Klienti) */
  tenant: env.VITE_REZERVACE_TENANT || "webcozvoni",
};

const api = `${REZERVACE.url}/api/public/${encodeURIComponent(REZERVACE.tenant)}`;

export type Service = { id: string; name: string; description: string | null; durationMin: number };
export type Info = {
  services: Service[];
  /** bookable days as "YYYY-MM-DD", in Prague time */
  dates: string[];
};
export type Slot = { start: string; end: string; label: string };

/** Error from the API: `code` is the system's error code (SLOT_TAKEN, RATE_LIMITED…), `message` is Czech and shown as is */
export class ApiError extends Error {
  code: string;
  constructor(message: string, code = "NETWORK") {
    super(message);
    this.code = code;
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  if (!REZERVACE.url) throw new ApiError("Online kalendář teď není k dispozici.", "NOT_CONFIGURED");
  let res: Response;
  try {
    res = await fetch(`${api}${path}`, init);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ApiError("Spojení s kalendářem se nezdařilo. Zkontrolujte připojení a zkuste to znovu.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.message ?? "Něco se pokazilo. Zkuste to prosím znovu.", json.error);
  return json as T;
}

let infoPromise: Promise<Info> | null = null;

/** The meeting type and the bookable days — fetched once, as soon as someone opens the meeting tab */
export function getInfo(): Promise<Info> {
  infoPromise ??= call<Info>("").catch((e) => {
    infoPromise = null; // let the next try fetch again
    throw e;
  });
  return infoPromise;
}

export async function getSlots(serviceId: string, date: string, signal?: AbortSignal): Promise<Slot[]> {
  const q = new URLSearchParams({ serviceId, date });
  return (await call<{ slots: Slot[] }>(`/availability?${q}`, { signal })).slots;
}

export type MeetingRequest = {
  serviceId: string;
  start: string;
  name: string;
  email: string;
  phone: string;
  /** the trade goes into the system's extra field (labelled "Obor" in its settings) */
  vehicle: string;
  note: string;
  /** one key per filled-in form, so a double click doesn't create two requests */
  idempotencyKey: string;
};

export function requestMeeting(body: MeetingRequest) {
  return call<{ id: string; status: string; start: string }>("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // the form's privacy note stands for the consent the system asks for
    body: JSON.stringify({ ...body, consent: true, website: "" }),
  });
}

/* ---------- dates come as "YYYY-MM-DD": read them as calendar days, not instants ---------- */

const DAY_SHORT = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
const DAY_LONG = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];

function parts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), d, m };
}

/** { short: "Út", date: "4. 11." } for the day chips */
export function dayParts(date: string) {
  const p = parts(date);
  return { short: DAY_SHORT[p.wd], date: `${p.d}. ${p.m}.` };
}

/** "úterý 4. 11." */
export function dayLabel(date: string) {
  const p = parts(date);
  return `${DAY_LONG[p.wd]} ${p.d}. ${p.m}.`;
}
