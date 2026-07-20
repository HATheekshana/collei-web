import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import Banner from "@/lib/models/Banner";
import Endgame from "@/lib/models/Endgame";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

const ENDGAME_LABELS = {
  abyss: { label: "Spiral Abyss", icon: "🌀" },
  theatre: { label: "Imaginarium Theater", icon: "🎭" },
  stygian: { label: "Stygian Onslaught", icon: "🩸" }
};

async function getSnapshot() {
  await dbConnect();
  const [banner, endgameDocs] = await Promise.all([
    Banner.findOne({ key: "singleton" }).lean(),
    Endgame.find({}).lean()
  ]);
  return { banner, endgameDocs };
}

export default async function HomePage() {
  const { banner, endgameDocs } = await getSnapshot();

  return (
    <div className="space-y-20">
      <section className="pt-6 sm:pt-14 grid sm:grid-cols-[1.2fr,1fr] gap-10 items-center">
        <div>
          <p className="text-moss tracking-[0.3em] text-xs uppercase mb-4">
            A grove-keeper's almanac
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-parchment">
            Every character,
            <br />
            every build,
            <br />
            <span className="text-bloom">rooted in one place.</span>
          </h1>
          <p className="mt-6 text-parchment/65 max-w-md leading-relaxed">
            Collei's almanac gathers character build cards, boss notes, artifact
            sets, and live countdowns for banners, Abyss, Imaginarium Theater,
            and Stygian Onslaught — kept fresh by the grove's keepers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/characters"
              className="bg-moss text-canopy-950 font-medium px-5 py-2.5 rounded-full hover:bg-sprout transition-colors"
            >
              Browse characters
            </Link>
            <Link
              href="/endgame"
              className="border border-canopy-600 px-5 py-2.5 rounded-full hover:border-bloom hover:text-bloom transition-colors"
            >
              Endgame countdowns
            </Link>
          </div>
        </div>
        <div className="leaf-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-sprout mb-1">Current banner</h2>
          {banner?.currentCharacters?.length ? (
            <p className="text-sm text-parchment/60 mb-4">
              Featuring {banner.currentCharacters.join(", ")}
            </p>
          ) : (
            <p className="text-sm text-parchment/40 mb-4">No banner data set yet.</p>
          )}
          <Countdown regionTimes={banner?.currentEnd} doneLabel="Wishes closed" />
          <div className="sigil-divider my-5" />
          <Link href="/banners" className="text-xs text-moss hover:text-bloom">
            See current &amp; upcoming banners →
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-3xl text-parchment">Endgame, at a glance</h2>
          <Link href="/endgame" className="text-xs text-moss hover:text-bloom">
            Full countdowns →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {endgameDocs.map((doc) => (
            <div key={doc.mode} className="leaf-card rounded-2xl p-5">
              <div className="text-2xl mb-1">{ENDGAME_LABELS[doc.mode]?.icon}</div>
              <h3 className="font-display text-xl text-sprout mb-3">{doc.label}</h3>
              <Countdown regionTimes={doc.currentEnd} doneLabel="Resetting" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-5">
        {[
          { href: "/bosses", title: "Boss notes", desc: "Weekly boss locations, drops, and fight guides.", icon: "🐉" },
          { href: "/artifacts", title: "Artifact sets", desc: "Two- and four-piece bonuses at a glance.", icon: "💠" },
          { href: "/characters", title: "Build guides", desc: "Curated infographic builds per character.", icon: "📜" }
        ].map((c) => (
          <Link key={c.href} href={c.href} className="leaf-card rounded-2xl p-6 block hover:-translate-y-0.5 transition-transform">
            <div className="text-2xl mb-2">{c.icon}</div>
            <h3 className="font-display text-xl text-sprout mb-1">{c.title}</h3>
            <p className="text-sm text-parchment/60">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
