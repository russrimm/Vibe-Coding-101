/**
 * Paid 1:1 coaching settings. Values come from public, build-time `VITE_`
 * variables because they are shown to every visitor. Never put secrets here:
 * payment happens on the external scheduling provider, not in this portal.
 */
export interface CoachingConfig {
  /** Public https booking page (for example Cal.com or Calendly), or null when booking is closed. */
  bookingUrl: string | null
  /** Display-only price, such as "$49 USD". The provider's checkout is authoritative. */
  priceLabel: string | null
  durationMinutes: number
  contactUrl: string
}

type CoachingEnv = Partial<Record<string, string | boolean | undefined>>

export const DEFAULT_COACHING_MINUTES = 60
export const COACHING_CONTACT_URL = 'https://www.linkedin.com/in/russrimm'

export function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && !url.username && !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

function priceLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const label = value.trim()
  return label && label.length <= 40 ? label : null
}

function durationMinutes(value: unknown): number {
  if (typeof value !== 'string' || !/^\d{2,3}$/.test(value.trim()))
    return DEFAULT_COACHING_MINUTES
  const minutes = Number(value.trim())
  return minutes >= 15 && minutes <= 240 ? minutes : DEFAULT_COACHING_MINUTES
}

/** Invalid or missing values fall back to a safe "booking not open yet" state. */
export function resolveCoachingConfig(env: CoachingEnv): CoachingConfig {
  return {
    bookingUrl: safeHttpsUrl(env.VITE_COACHING_BOOKING_URL),
    priceLabel: priceLabel(env.VITE_COACHING_PRICE),
    durationMinutes: durationMinutes(env.VITE_COACHING_DURATION_MINUTES),
    contactUrl: COACHING_CONTACT_URL,
  }
}

// `import.meta.env` is absent when Node-based tests import this module.
export const coachingConfig = resolveCoachingConfig(import.meta.env ?? {})
