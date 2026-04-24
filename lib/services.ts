/**
 * Single source of truth for bookable services.
 * Used by both the client-side BookingCalendar and the API routes.
 */

export type Service = {
  id: string
  title: string
  duration: number | null // minutes; null = email-only (no calendar slot)
  price: number
  currency: string
  delivery: string
  description: string
  emailOnly?: boolean
}

export const services: Service[] = [
  {
    id: "shamanic",
    title: "Shamanic Power Retrieval",
    duration: 90,
    price: 77,
    currency: "£",
    delivery: "In person or online",
    description:
      "Shamanic Power Retrieval is a deeply sacred healing practice that gently restores the parts of ourselves we may have lost through trauma, fear, or life's many challenges.",
  },
  {
    id: "pasale",
    title: "Pásale Healing",
    duration: 90,
    price: 77,
    currency: "£",
    delivery: "In person or online",
    description:
      "Pásale is a sacred shamanic healing practice, gifted to me through the teachings of an Apache Warrior Shaman.",
  },
  {
    id: "tarot",
    title: "Psychic Tarot Reading",
    duration: 45,
    price: 45,
    currency: "£",
    delivery: "In person or online",
    description:
      "Deeply intuitive, shamanic-led psychic readings that connect you with guidance, clarity, and insight.",
  },
  {
    id: "rune",
    title: "Rune Reading",
    duration: 45,
    price: 45,
    currency: "£",
    delivery: "In person or online",
    description:
      "Rune readings rooted in the ancient Elder Futhark, drawing on Norse wisdom to illuminate your path.",
  },
  {
    id: "email",
    title: "Email Reading",
    duration: null,
    price: 29,
    currency: "£",
    delivery: "Delivered 24–48 hrs",
    description:
      "A written intuitive reading delivered to your inbox — perfect if you prefer a response you can revisit anytime.",
    emailOnly: true,
  },
]

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}
