import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Endgame from "@/lib/models/Endgame";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

const DEFAULTS = [
  { mode: "abyss", label: "Spiral Abyss", icon: "🌀" },
  { mode: "theatre", label: "Imaginarium Theater", icon: "🎭" },
  { mode: "stygian", label: "Stygian Onslaught", icon: "🩸" }
];

export default async function EndgamePage() {
  await dbConnect();
  const docs = await Endgame.find({}).lean();
  const byMode = Object.fromEntries(docs.map((d) => [d.mode, d]));

  return (
    <div>
      <h1 className="font-display text-4xl text-parchment mb-2">Endgame</h1>
      <p className="text-parchment/60 mb-10">
        Reset countdowns for Spiral Abyss, Imaginarium Theater, and Stygian Onslaught.
      </p>

      <div className="space-y-10">
        {DEFAULTS.map((meta) => {
          const doc = byMode[meta.mode] || {};
          return (
            <section key={meta.mode} className="leaf-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{meta.icon}</span>
                <h2 className="font-display text-2xl text-sprout">{meta.label}</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-moss mb-2">Current — ends in</h3>
                  <Countdown regionTimes={doc.currentEnd} doneLabel="Resetting" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-moss mb-2">Next — starts in</h3>
                  <Countdown regionTimes={doc.nextStart} doneLabel="Live now" />
                </div>
              </div>

              {(doc.currentImages?.length > 0 || doc.nextImages?.length > 0) && (
                <>
                  <div className="sigil-divider my-6" />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      {doc.currentImages?.length > 0 && (
                        <>
                          <h4 className="text-xs uppercase tracking-widest text-moss mb-2">Current lineup</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {doc.currentImages.map((url, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-canopy-900">
                                <Image src={url} alt={`${meta.label} current ${i + 1}`} fill className="object-contain" />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      {doc.nextImages?.length > 0 && (
                        <>
                          <h4 className="text-xs uppercase tracking-widest text-moss mb-2">Next lineup</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {doc.nextImages.map((url, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-canopy-900">
                                <Image src={url} alt={`${meta.label} next ${i + 1}`} fill className="object-contain" />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
