"use client";

import { useEffect, useState } from "react";
import ImageInput from "@/components/ImageInput";

const EMPTY = { name: "", characterKey: "", imageUrl: "", element: "", weapon: "", rarity: 5 };

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/characters");
    setCharacters(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(c) {
    setEditingId(c._id);
    setForm({
      name: c.name,
      characterKey: c.characterKey,
      imageUrl: c.imageUrl,
      element: c.element || "",
      weapon: c.weapon || "",
      rarity: c.rarity || 5
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { ...form, rarity: Number(form.rarity) };
    const res = await fetch(editingId ? `/api/characters/${editingId}` : "/api/characters", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    resetForm();
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this character and its guides?")) return;
    await fetch(`/api/characters/${id}`, { method: "DELETE" });
    load();
  }

  function suggestKey(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-6">Characters</h1>

      <form onSubmit={handleSubmit} className="leaf-card rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="text-sm text-bloom mb-1">{editingId ? "Edit character" : "Add character"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Name</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  characterKey: editingId ? f.characterKey : suggestKey(name)
                }));
              }}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">
              Key (unique, url-safe)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.characterKey}
              onChange={(e) => setForm((f) => ({ ...f, characterKey: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Element</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.element}
              onChange={(e) => setForm((f) => ({ ...f, element: e.target.value }))}
              placeholder="Dendro"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Weapon</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.weapon}
              onChange={(e) => setForm((f) => ({ ...f, weapon: e.target.value }))}
              placeholder="Bow"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Rarity</label>
            <select
              className="w-full rounded-lg px-3 py-2"
              value={form.rarity}
              onChange={(e) => setForm((f) => ({ ...f, rarity: e.target.value }))}
            >
              <option value={4}>4★</option>
              <option value={5}>5★</option>
            </select>
          </div>
        </div>
        <ImageInput label="Card image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors" type="submit">
            {editingId ? "Save changes" : "Add character"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-parchment/50 hover:text-parchment">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-parchment/50">Loading…</p>
      ) : (
        <div className="space-y-2">
          {characters.map((c) => (
            <div key={c._id} className="leaf-card rounded-xl p-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.imageUrl} alt={c.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="text-sprout">{c.name}</div>
                <div className="text-xs text-parchment/40">{c.characterKey}</div>
              </div>
              <button onClick={() => startEdit(c)} className="text-xs text-moss hover:text-bloom">
                Edit
              </button>
              <button onClick={() => handleDelete(c._id)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
