"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SECTIONS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/characters", label: "Characters" },
  { href: "/admin/guides", label: "Build guides" },
  { href: "/admin/bosses", label: "Bosses" },
  { href: "/admin/artifacts", label: "Artifacts" },
  { href: "/admin/endgame", label: "Endgame" },
  { href: "/admin/banners", label: "Banners" }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return children;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="grid sm:grid-cols-[200px,1fr] gap-8">
      <aside className="space-y-1">
        <h2 className="font-display text-xl text-bloom mb-3">Keeper Panel</h2>
        {SECTIONS.map((s) => {
          const active = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                active ? "bg-canopy-700 text-bloom" : "text-parchment/70 hover:bg-canopy-800"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="block w-full text-left text-sm px-3 py-2 rounded-lg text-parchment/50 hover:bg-canopy-800 hover:text-red-400 transition-colors mt-4"
        >
          Log out
        </button>
      </aside>
      <div>{children}</div>
    </div>
  );
}
