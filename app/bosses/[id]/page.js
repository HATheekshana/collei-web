import Image from "next/image";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Boss from "@/lib/models/Boss";

export const dynamic = "force-dynamic";

export default async function BossDetailPage({ params }) {
  await dbConnect();
  let boss;
  try {
    boss = await Boss.findById(params.id).lean();
  } catch {
    notFound();
  }
  if (!boss) notFound();

  return (
    <div className="grid sm:grid-cols-[280px,1fr] gap-10">
      <div>
        <div className="leaf-card rounded-2xl overflow-hidden">
          <div className="relative aspect-square bg-canopy-800">
            {boss.imageUrl ? (
              <Image src={boss.imageUrl} alt={boss.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">🐉</div>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm text-parchment/70">
          {boss.location && <div>Location: <span className="text-sprout">{boss.location}</span></div>}
          {boss.drops && <div>Drops: <span className="text-sprout">{boss.drops}</span></div>}
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl text-parchment mb-8">{boss.name}</h1>

        {(!boss.guideImages || boss.guideImages.length === 0) && (
          <p className="text-parchment/50">No fight guide images added yet.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {(boss.guideImages || []).map((url, i) => (
            <div key={i} className="leaf-card rounded-xl overflow-hidden relative aspect-video">
              <Image src={url} alt={`${boss.name} guide ${i + 1}`} fill className="object-contain bg-canopy-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
