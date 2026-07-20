"use client";

import { useEffect, useState } from "react";
import RegionTimeInput from "@/components/RegionTimeInput";
import ImageListInput from "@/components/ImageListInput";

const EMPTY = {
  currentCharacters: [],
  currentIcons: [],
  currentEnd: {},
  nextCharacters: [],
  nextIcons: [],
  nextStart: {},
  specialEventName: "",
  specialEventStart: {}
};

export default function AdminBannersPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/banners");
    const data = await res.json();
    setForm({ ...EMPTY, ...data, specialEventName: data.specialEventName || "" });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      currentIcons: (form.currentIcons || []).filter(Boolean),
      nextIcons: (form.nextIcons || []).filter(Boolean)
    };
    const res = await fetch("/api/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    setMessage(res.ok ? "Banners saved." : "Failed to save.");
    if (res.ok) load();
  }

  if (loading) return <p className="text-parchment/50">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-6">Banners</h1>
      {message && <p className="text-sm text-bloom mb-4">{message}</p>}

      <div className="space-y-6">
        <section className="leaf-card rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-xl text-sprout">Current banner</h2>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">
              Featured characters (comma-separated)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={(form.currentCharacters || []).join(", ")}
              onChange={(e) =>
                update({ currentCharacters: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <RegionTimeInput label="Ends at" value={form.currentEnd} onChange={(v) => update({ currentEnd: v })} />
          <ImageListInput label="Character icons" values={form.currentIcons} onChange={(v) => update({ currentIcons: v })} />
        </section>

        <section className="leaf-card rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-xl text-sprout">Next banner</h2>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">
              Featured characters (comma-separated, leave blank if TBA)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={(form.nextCharacters || []).join(", ")}
              onChange={(e) =>
                update({ nextCharacters: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <RegionTimeInput label="Starts at" value={form.nextStart} onChange={(v) => update({ nextStart: v })} />
          <ImageListInput label="Character icons" values={form.nextIcons} onChange={(v) => update({ nextIcons: v })} />
        </section>

        <section className="leaf-card rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-xl text-sprout">Special event (optional)</h2>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Event name</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.specialEventName || ""}
              onChange={(e) => update({ specialEventName: e.target.value })}
            />
          </div>
          <RegionTimeInput
            label="Starts at"
            value={form.specialEventStart}
            onChange={(v) => update({ specialEventStart: v })}
          />
        </section>

        <button
          onClick={save}
          disabled={saving}
          className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save banners"}
        </button>
      </div>
    </div>
  );
}
