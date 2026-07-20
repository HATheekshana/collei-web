"use client";

import { useEffect, useState } from "react";
import ImageInput from "@/components/ImageInput";

const EMPTY = { name: "", characterKey: "", imageUrl: "" };

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [guidesRes, charsRes] = await Promise.all([
      fetch("/api/guides"),
      fetch("/api/characters")
    ]);
    setGuides(await guidesRes.json());
    setCharacters(await charsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(g) {
    setEditingId(g._id);
    setForm({ name: g.name, characterKey: g.characterKey, imageUrl: g.imageUrl });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...EMPTY, characterKey: characters[0]?.characterKey || "" });
  }

  useEffect(() => {
    if (characters.length && !form.characterKey) {
      setForm((f) => ({ ...f, characterKey: characters[0].characterKey }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.characterKey) {
      setError("Add a character first, then add its guides.");
      return;
    }
    const res = await fetch(editingId ? `/api/guides/${editingId}` : "/api/guides", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
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
    if (!confirm("Delete this guide image?")) return;
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    load();
  }

  const nameFor = (key) => characters.find((c) => c.characterKey === key)?.name || key;

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-6">Build guides</h1>

      {characters.length === 0 && !loading && (
        <p className="text-parchment/50 mb-6">
          Add at least one character first — guides are attached to a character.
        </p>
      )}

      <form onSubmit={handleSubmit} className="leaf-card rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="text-sm text-bloom mb-1">{editingId ? "Edit guide" : "Add guide"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Character</label>
            <select
              className="w-full rounded-lg px-3 py-2"
              value={form.characterKey}
              onChange={(e) => setForm((f) => ({ ...f, characterKey: e.target.value }))}
            >
              {characters.map((c) => (
                <option key={c.characterKey} value={c.characterKey}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Guide title</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Dendro DPS 5.4"
              required
            />
          </div>
        </div>
        <ImageInput label="Guide image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors" type="submit">
            {editingId ? "Save changes" : "Add guide"}
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
          {guides.map((g) => (
            <div key={g._id} className="leaf-card rounded-xl p-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.imageUrl} alt={g.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="text-sprout">{g.name}</div>
                <div className="text-xs text-parchment/40">{nameFor(g.characterKey)}</div>
              </div>
              <button onClick={() => startEdit(g)} className="text-xs text-moss hover:text-bloom">
                Edit
              </button>
              <button onClick={() => handleDelete(g._id)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
