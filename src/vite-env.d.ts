/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public https scheduling page that collects payment, e.g. Cal.com or Calendly. */
  readonly VITE_COACHING_BOOKING_URL?: string
  /** Display-only price label, e.g. "$49 USD". */
  readonly VITE_COACHING_PRICE?: string
  /** Session length in minutes (15–240). Defaults to 60. */
  readonly VITE_COACHING_DURATION_MINUTES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
