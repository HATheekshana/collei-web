import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Banner from "@/lib/models/Banner";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  await dbConnect();
  const banner = (await Banner.findOne({ key: "singleton" }).lean()) || {};

  return (
    <div>
      <h1 className="font-display text-4xl text-parchment mb-2">Wish Banners</h1>
      <p className="text-parchment/60 mb-10">Current and upcoming character banners.</p>

      <div className="grid sm:grid-cols-2 gap-6">
        <section className="leaf-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-sprout mb-4">Current banner</h2>
          <Countdown regionTimes={banner.currentEnd} doneLabel="Wishes closed" />
          {banner.currentCharacters?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-widest text-moss mb-2">Featured</h3>
              <ul className="text-sm text-parchment/80 space-y-1">
                {banner.currentCharacters.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>
          )}
          {banner.currentIcons?.length > 0 && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {banner.currentIcons.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-full overflow-hidden bg-canopy-800 border border-canopy-600">
                  <Image src={url} alt="Character icon" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="leaf-card rounded-2xl p-6">
          <h2 className="font-display text-2xl text-sprout mb-4">Next banner</h2>
          <Countdown regionTimes={banner.nextStart} doneLabel="Live now" notAnnouncedLabel="Not yet announced" />
          {banner.nextCharacters?.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-widest text-moss mb-2">Featured</h3>
              <ul className="text-sm text-parchment/80 space-y-1">
                {banner.nextCharacters.map((n) => (
                  <li key={n}>• {n}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 text-sm text-parchment/40">Characters not yet revealed.</p>
          )}
          {banner.nextIcons?.length > 0 && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {banner.nextIcons.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-full overflow-hidden bg-canopy-800 border border-canopy-600">
                  <Image src={url} alt="Character icon" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {banner.specialEventName && (
        <section className="leaf-card rounded-2xl p-6 mt-6">
          <h2 className="font-display text-2xl text-sprout mb-4">{banner.specialEventName}</h2>
          <Countdown regionTimes={banner.specialEventStart} />
        </section>
      )}
    </div>
  );
}
