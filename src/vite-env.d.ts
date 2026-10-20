/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** address of the booking system (rezervacni-system); unset = the booking section is hidden */
  readonly VITE_REZERVACE_URL?: string;
}
