import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import Character from "@/lib/models/Character";
import Guide from "@/lib/models/Guide";
import Boss from "@/lib/models/Boss";
import Artifact from "@/lib/models/Artifact";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await dbConnect();
  const [characters, guides, bosses, artifacts] = await Promise.all([
    Character.countDocuments(),
    Guide.countDocuments(),
    Boss.countDocuments(),
    Artifact.countDocuments()
  ]);

  const cards = [
    { href: "/admin/characters", label: "Characters", count: characters },
    { href: "/admin/guides", label: "Build guides", count: guides },
    { href: "/admin/bosses", label: "Bosses", count: bosses },
    { href: "/admin/artifacts", label: "Artifact sets", count: artifacts }
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-1">Welcome back, keeper</h1>
      <p className="text-parchment/50 mb-8">Manage the almanac's content from here.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="leaf-card rounded-xl p-5 flex items-center justify-between hover:border-bloom/60">
            <span className="text-sprout">{c.label}</span>
            <span className="font-display text-2xl text-bloom">{c.count}</span>
          </Link>
        ))}
      </div>
      <p className="text-xs text-parchment/40 mt-8">
        Tip: also visit <Link href="/admin/endgame" className="underline hover:text-bloom">Endgame</Link> and{" "}
        <Link href="/admin/banners" className="underline hover:text-bloom">Banners</Link> to keep countdowns current.
      </p>
    </div>
  );
}
