import Image from "next/image";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Character from "@/lib/models/Character";
import Guide from "@/lib/models/Guide";

export const dynamic = "force-dynamic";

export default async function CharacterDetailPage({ params }) {
  await dbConnect();
  const character = await Character.findOne({ characterKey: params.key }).lean();
  if (!character) notFound();

  const guides = await Guide.find({ characterKey: params.key }).sort({ name: 1 }).lean();

  return (
    <div className="grid sm:grid-cols-[280px,1fr] gap-10">
      <div>
        <div className="leaf-card rounded-2xl overflow-hidden">
          <div className="relative aspect-[3/4]">
            <Image src={character.imageUrl} alt={character.name} fill className="object-cover" />
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm text-parchment/70">
          {character.element && <div>Element: <span className="text-sprout">{character.element}</span></div>}
          {character.weapon && <div>Weapon: <span className="text-sprout">{character.weapon}</span></div>}
          {character.rarity && <div>Rarity: <span className="text-bloom">{"★".repeat(character.rarity)}</span></div>}
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl text-parchment mb-1">{character.name}</h1>
        <p className="text-parchment/50 mb-8">Build guides</p>

        {guides.length === 0 && (
          <p className="text-parchment/50">No build guides added for {character.name} yet.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {guides.map((g) => (
            <div key={g._id} className="leaf-card rounded-xl overflow-hidden">
              <div className="relative aspect-square">
                <Image src={g.imageUrl} alt={g.name} fill className="object-contain bg-canopy-900" />
              </div>
              <div className="p-3 text-sm text-parchment/70">{g.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
