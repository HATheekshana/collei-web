import Link from "next/link";
import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Boss from "@/lib/models/Boss";

export const dynamic = "force-dynamic";

export default async function BossesPage() {
  await dbConnect();
  const bosses = await Boss.find({}).sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="font-display text-4xl text-parchment mb-2">Bosses</h1>
      <p className="text-parchment/60 mb-8">Locations, drops, and fight notes.</p>

      {bosses.length === 0 && (
        <p className="text-parchment/50">No bosses catalogued yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {bosses.map((b) => (
          <Link key={b._id} href={`/bosses/${b._id}`} className="leaf-card rounded-xl overflow-hidden group">
            <div className="relative aspect-square bg-canopy-800">
              {b.imageUrl ? (
                <Image src={b.imageUrl} alt={b.name} fill sizes="220px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🐉</div>
              )}
            </div>
            <div className="p-2 text-center text-sm text-sprout group-hover:text-bloom transition-colors">
              {b.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
