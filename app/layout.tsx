import type { Metadata } from "next"
import { Cormorant_Garamond, Lato, Pinyon_Script } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
})

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Alison Thomas — Spiritual Medium & Healer | Isle of Man",
  description:
    "Alison Thomas is a professional evidential medium and former police detective based in Onchan, Isle of Man. Honest, evidence-based readings and healing sessions available worldwide online and in-person.",
  generator: "v0.app",
  metadataBase: new URL("https://alisonthomasmedium.com"),
  openGraph: {
    title: "Alison Thomas — Spiritual Medium & Healer",
    description:
      "Evidence-based mediumship and spiritual healing from a former police detective. Readings worldwide, online and in-person from the Isle of Man.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lato.variable} ${pinyonScript.variable} bg-background`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
