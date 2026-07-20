"use client";

import { useEffect, useState } from "react";

function diffParts(targetIso) {
  if (!targetIso) return null;
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const ms = target - now;
  if (ms <= 0) return { done: true };
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { done: false, days, hours, minutes, seconds };
}

/**
 * regionTimes: { Asia: isoString|null, EU: isoString|null, NA: isoString|null }
 * doneLabel: text shown once a region's timer has reached zero
 * notAnnouncedLabel: text shown when a region has no target time set
 */
export default function Countdown({ regionTimes, doneLabel = "Live now", notAnnouncedLabel = "Not yet announced" }) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const regions = ["Asia", "EU", "NA"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {regions.map((region) => {
        const iso = regionTimes?.[region];
        const parts = diffParts(iso);
        return (
          <div
            key={region}
            className="rounded-lg border border-canopy-600/70 bg-canopy-900/60 px-3 py-2 text-center"
          >
            <div className="text-[10px] uppercase tracking-widest text-moss">{region}</div>
            {!iso && (
              <div className="text-sm text-parchment/50 py-1.5">{notAnnouncedLabel}</div>
            )}
            {iso && parts?.done && (
              <div className="text-sm text-bloom py-1.5">{doneLabel}</div>
            )}
            {iso && parts && !parts.done && (
              <div className="font-display text-lg text-sprout tabular-nums">
                {parts.days}d {String(parts.hours).padStart(2, "0")}h{" "}
                {String(parts.minutes).padStart(2, "0")}m{" "}
                {String(parts.seconds).padStart(2, "0")}s
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
