"use client";

import { useEffect, useState } from "react";
import ImageInput from "@/components/ImageInput";
import ImageListInput from "@/components/ImageListInput";

const EMPTY = { name: "", imageUrl: "", location: "", drops: "", guideImages: [] };

export default function AdminBossesPage() {
  const [bosses, setBosses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/bosses");
    setBosses(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(b) {
    setEditingId(b._id);
    setForm({
      name: b.name,
      imageUrl: b.imageUrl || "",
      location: b.location || "",
      drops: b.drops || "",
      guideImages: b.guideImages || []
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { ...form, guideImages: form.guideImages.filter(Boolean) };
    const res = await fetch(editingId ? `/api/bosses/${editingId}` : "/api/bosses", {
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
    if (!confirm("Delete this boss?")) return;
    await fetch(`/api/bosses/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-6">Bosses</h1>

      <form onSubmit={handleSubmit} className="leaf-card rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="text-sm text-bloom mb-1">{editingId ? "Edit boss" : "Add boss"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Name</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-moss mb-1">Location</label>
            <input
              className="w-full rounded-lg px-3 py-2"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">Drops</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={form.drops}
            onChange={(e) => setForm((f) => ({ ...f, drops: e.target.value }))}
            placeholder="Comma-separated drop names"
          />
        </div>
        <ImageInput label="Boss card image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
        <ImageListInput label="Fight guide images" values={form.guideImages} onChange={(v) => setForm((f) => ({ ...f, guideImages: v }))} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors" type="submit">
            {editingId ? "Save changes" : "Add boss"}
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
          {bosses.map((b) => (
            <div key={b._id} className="leaf-card rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sprout">{b.name}</div>
                <div className="text-xs text-parchment/40">{b.guideImages?.length || 0} guide image(s)</div>
              </div>
              <button onClick={() => startEdit(b)} className="text-xs text-moss hover:text-bloom">
                Edit
              </button>
              <button onClick={() => handleDelete(b._id)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
