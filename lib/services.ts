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
      "Shamanic Power Retrieval is a deeply sacred healing practice that gently restores the parts of ourselves we may have lost through trauma, fear, or life's many challenges. Over time, we can feel disconnected from our inner strength, purpose, or sense of wholeness — as though something vital is missing. Through this ancient healing work, I lovingly call back your innate power and spiritual vitality, helping you feel more grounded, alive, and aligned with who you truly are. It's a beautiful way to reconnect with your soul's essence and awaken the strength that has always lived within you.",
  },
  {
    id: "pasale",
    title: "Pásale Healing",
    duration: 90,
    price: 77,
    currency: "£",
    delivery: "In person or online",
    description:
      "Pásale is a sacred shamanic healing practice, gifted to me through the teachings of an Apache Warrior Shaman, a 4th generation Curandero and Sundancer. I am honoured to be one of just 34 healers worldwide trained in this deeply transformative modality. Pásale is a healing journey for those carrying trauma — whether recent or long-held — yet unlike traditional talk therapy, you don't need to speak about the event itself. Instead, I gently guide you through the energetic layers of your experience, allowing your own body to safely release what it has held onto. This is a space of deep honouring, where true healing begins from within, and the spirit is gently restored to peace.",
  },
  {
    id: "tarot",
    title: "Psychic Tarot Card Reading",
    duration: 45,
    price: 45,
    currency: "£",
    delivery: "In person or online",
    description:
      "I offer deeply intuitive, shamanic-led psychic readings, where I gently connect into your energy and the unseen layers around you to bring clarity, truth, and guidance. Working with the Rider Waite Smith tarot and a range of carefully chosen spreads, I allow each reading to unfold organically, answering your questions while also revealing what your soul is ready to see. These sessions are not just about insight — they are a space for transformation, where patterns can be understood, energy can shift, and you can reconnect with your own inner knowing in a way that feels empowering and real.",
  },
  {
    id: "rune",
    title: "Rune Reading",
    duration: 45,
    price: 45,
    currency: "£",
    delivery: "In person or online",
    description:
      "I offer rune readings rooted in the ancient Elder Futhark, drawing through the deep, northern currents of shamanic and Norse tradition. These sacred symbols carry the voice of the old ways — steady, wise, and deeply connected to the rhythms of nature, fate, and becoming. As I work intuitively with the runes and a range of spreads, they reveal what lies beneath the surface of your questions, bringing insight into cycles, challenges, and the path ahead. This is grounding, soul-level guidance — supporting you to stand in your strength, honour your journey, and move forward with clarity and purpose.",
  },
  {
    id: "email",
    title: "Email Tarot or Rune Readings",
    duration: null,
    price: 29,
    currency: "£",
    delivery: "Delivered 24–48 hrs",
    description:
      "I offer intuitive distance readings via email using either the Rider Waite Smith tarot or the Elder Futhark runes. You simply send your question, and I will draw up to three cards or runes to bring through clear, grounded guidance and insight. Your reading is recorded as a private video, where I walk you through the messages and energies that come forward. All readings are delivered within 24–48 hours, offering you time and space to receive meaningful, personal guidance you can return to whenever you need.",
    emailOnly: true,
  },
]

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}
