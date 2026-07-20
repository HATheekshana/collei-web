import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Artifact from "@/lib/models/Artifact";

export const dynamic = "force-dynamic";

export default async function ArtifactsPage() {
  await dbConnect();
  const artifacts = await Artifact.find({}).sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="font-display text-4xl text-parchment mb-2">Artifact sets</h1>
      <p className="text-parchment/60 mb-8">Two- and four-piece bonuses at a glance.</p>

      {artifacts.length === 0 && (
        <p className="text-parchment/50">No artifact sets catalogued yet.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {artifacts.map((a) => (
          <div key={a._id} className="leaf-card rounded-2xl p-5 flex gap-4">
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-canopy-800">
              {a.imageUrl ? (
                <Image src={a.imageUrl} alt={a.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">💠</div>
              )}
            </div>
            <div>
              <h2 className="font-display text-xl text-sprout mb-1">{a.name}</h2>
              {a.twoPiece && (
                <p className="text-sm text-parchment/70 mb-1">
                  <span className="text-bloom">2pc:</span> {a.twoPiece}
                </p>
              )}
              {a.fourPiece && (
                <p className="text-sm text-parchment/70 mb-1">
                  <span className="text-bloom">4pc:</span> {a.fourPiece}
                </p>
              )}
              {a.bestFor && (
                <p className="text-xs text-parchment/50 mt-2">Best for: {a.bestFor}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
