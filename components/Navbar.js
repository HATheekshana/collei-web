"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/characters", label: "Characters" },
  { href: "/bosses", label: "Bosses" },
  { href: "/artifacts", label: "Artifacts" },
  { href: "/endgame", label: "Endgame" },
  { href: "/banners", label: "Banners" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-canopy-700/60 sticky top-0 z-30 bg-canopy-950/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌿</span>
          <span className="font-display text-2xl tracking-wide text-sprout group-hover:text-bloom transition-colors">
            Collei
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active ? "text-bloom" : "text-parchment/70 hover:text-sprout"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/admin"
          className="text-xs uppercase tracking-widest text-parchment/40 hover:text-bloom border border-canopy-600 rounded-full px-3 py-1.5 transition-colors"
        >
          Keeper Login
        </Link>
      </div>
      <nav className="sm:hidden flex overflow-x-auto gap-4 px-4 pb-3 text-sm">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-parchment/70 whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
