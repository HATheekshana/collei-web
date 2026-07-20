import Link from "next/link";
import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Character from "@/lib/models/Character";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  await dbConnect();
  const characters = await Character.find({}).sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="font-display text-4xl text-parchment mb-2">Characters</h1>
      <p className="text-parchment/60 mb-8">
        {characters.length} traveler{characters.length === 1 ? "" : "s"} catalogued so far.
      </p>

      {characters.length === 0 && (
        <p className="text-parchment/50">
          No characters yet — add some from the Keeper admin panel.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {characters.map((c) => (
          <Link
            key={c._id}
            href={`/characters/${c.characterKey}`}
            className="leaf-card rounded-xl overflow-hidden group"
          >
            <div className="relative aspect-[3/4] bg-canopy-800">
              <Image
                src={c.imageUrl}
                alt={c.name}
                fill
                sizes="200px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 text-center">
              <div className="text-sm text-sprout group-hover:text-bloom transition-colors">
                {c.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
