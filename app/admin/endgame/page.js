"use client";

import { useEffect, useState } from "react";
import RegionTimeInput from "@/components/RegionTimeInput";
import ImageListInput from "@/components/ImageListInput";

const DEFAULTS = [
  { mode: "abyss", label: "Spiral Abyss" },
  { mode: "theatre", label: "Imaginarium Theater" },
  { mode: "stygian", label: "Stygian Onslaught" }
];

export default function AdminEndgamePage() {
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingMode, setSavingMode] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/endgame");
    const list = await res.json();
    setDocs(Object.fromEntries(list.map((d) => [d.mode, d])));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(mode, patch) {
    setDocs((prev) => ({ ...prev, [mode]: { ...prev[mode], ...patch } }));
  }

  async function save(mode) {
    setSavingMode(mode);
    setMessage("");
    const doc = docs[mode];
    const res = await fetch("/api/endgame", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...doc,
        currentImages: (doc.currentImages || []).filter(Boolean),
        nextImages: (doc.nextImages || []).filter(Boolean)
      })
    });
    setSavingMode(null);
    if (res.ok) {
      setMessage(`${doc.label} saved.`);
      load();
    } else {
      setMessage("Failed to save.");
    }
  }

  if (loading) return <p className="text-parchment/50">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-1">Endgame</h1>
      <p className="text-parchment/50 mb-6">
        Set the reset window for each mode. Times are entered in your local timezone
        and converted automatically.
      </p>
      {message && <p className="text-sm text-bloom mb-4">{message}</p>}

      <div className="space-y-6">
        {DEFAULTS.map((meta) => {
          const doc = docs[meta.mode] || { mode: meta.mode, label: meta.label };
          return (
            <section key={meta.mode} className="leaf-card rounded-2xl p-5 space-y-4">
              <h2 className="font-display text-xl text-sprout">{meta.label}</h2>

              <RegionTimeInput
                label="Current window ends at"
                value={doc.currentEnd}
                onChange={(v) => update(meta.mode, { currentEnd: v })}
              />
              <RegionTimeInput
                label="Next window starts at"
                value={doc.nextStart}
                onChange={(v) => update(meta.mode, { nextStart: v })}
              />
              <ImageListInput
                label="Current lineup images"
                values={doc.currentImages}
                onChange={(v) => update(meta.mode, { currentImages: v })}
              />
              <ImageListInput
                label="Next lineup images"
                values={doc.nextImages}
                onChange={(v) => update(meta.mode, { nextImages: v })}
              />

              <button
                onClick={() => save(meta.mode)}
                disabled={savingMode === meta.mode}
                className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors disabled:opacity-50"
              >
                {savingMode === meta.mode ? "Saving…" : `Save ${meta.label}`}
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}
