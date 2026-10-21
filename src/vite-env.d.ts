/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** address of the booking system (rezervacni-system); unset = the booking section is hidden */
  readonly VITE_REZERVACE_URL?: string;
}

/** when `npm run build` ran (ms) — what the prerendered HTML shows until the browser knows today's date */
declare const __BUILD_TIME__: number;
