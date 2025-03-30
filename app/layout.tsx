import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Cinzel, Cormorant_Garamond, Poiret_One, Orbitron, Playfair_Display } from "next/font/google"

// Load fonts using Next.js font system
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const poiret = Poiret_One({
  subsets: ["latin"],
  variable: "--font-poiret",
  weight: ["400"],
  display: "swap",
})

// New premium fonts for enhanced visual appeal
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Joyel Immamnuel | Portfolio",
  description: "Personal portfolio of Joyel Immamnuel - Creative Developer & Digital Artist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${poiret.variable} ${orbitron.variable} ${playfair.variable}`}
      >
        {children}
      </body>
    </html>
  )
}



import './globals.css'