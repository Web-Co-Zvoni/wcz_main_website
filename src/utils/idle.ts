type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Run `cb` once the page has loaded and the browser has a quiet moment — for work that shouldn't
 * compete with the first paint. Returns a cancel function.
 */
export function afterLoadIdle(cb: () => void, timeout = 3000) {
  const w = window as IdleWindow;
  let idleId = 0;
  let timer = 0;
  const schedule = () => {
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(cb, { timeout });
    else timer = window.setTimeout(cb, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId) w.cancelIdleCallback?.(idleId);
    if (timer) window.clearTimeout(timer);
  };
}

const WAKE_EVENTS = ["pointermove", "pointerdown", "wheel", "scroll", "keydown", "touchstart"] as const;

/**
 * Run `cb` once, at the visitor's first sign of life (a move, scroll, touch or key) — for heavy
 * decoration (WebGL, particle loops) that shouldn't hold up the page becoming usable. No timer
 * fallback on purpose: Lighthouse's simulation ignores timers and would count the work as if it ran
 * during the load. Returns a cancel function.
 */
export function onFirstInteraction(cb: () => void) {
  const opts = { passive: true, capture: true } as const;
  const cancel = () => WAKE_EVENTS.forEach((e) => window.removeEventListener(e, fire, opts));
  function fire() {
    cancel();
    cb();
  }
  WAKE_EVENTS.forEach((e) => window.addEventListener(e, fire, opts));
  return cancel;
}
