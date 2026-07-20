import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

export const metadata = {
  title: "Collei — Traveler's Almanac",
  description:
    "Character build guides, boss notes, artifact sets, and live countdowns for banners, Abyss, Theater, and Stygian Onslaught."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-8">{children}</main>
        <footer className="border-t border-canopy-700/60 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-parchment/50 flex flex-col sm:flex-row justify-between gap-2">
            <span>Collei · a fan-made almanac. Not affiliated with HoYoverse.</span>
            <span>Built for the grove, tended by its keepers.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
