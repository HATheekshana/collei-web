"use client";

import { useEffect, useState } from "react";
import ImageInput from "@/components/ImageInput";

const EMPTY = { name: "", imageUrl: "", twoPiece: "", fourPiece: "", bestFor: "" };

export default function AdminArtifactsPage() {
  const [artifacts, setArtifacts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/artifacts");
    setArtifacts(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(a) {
    setEditingId(a._id);
    setForm({
      name: a.name,
      imageUrl: a.imageUrl || "",
      twoPiece: a.twoPiece || "",
      fourPiece: a.fourPiece || "",
      bestFor: a.bestFor || ""
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(editingId ? `/api/artifacts/${editingId}` : "/api/artifacts", {
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
    if (!confirm("Delete this artifact set?")) return;
    await fetch(`/api/artifacts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-parchment mb-6">Artifact sets</h1>

      <form onSubmit={handleSubmit} className="leaf-card rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="text-sm text-bloom mb-1">{editingId ? "Edit artifact set" : "Add artifact set"}</h2>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">Name</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Deepwood Memories"
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">2-piece bonus</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={form.twoPiece}
            onChange={(e) => setForm((f) => ({ ...f, twoPiece: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">4-piece bonus</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={form.fourPiece}
            onChange={(e) => setForm((f) => ({ ...f, fourPiece: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">Best for</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={form.bestFor}
            onChange={(e) => setForm((f) => ({ ...f, bestFor: e.target.value }))}
            placeholder="Dendro DPS / Catalyst users"
          />
        </div>
        <ImageInput label="Set image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button className="bg-moss text-canopy-950 font-medium px-5 py-2 rounded-full hover:bg-sprout transition-colors" type="submit">
            {editingId ? "Save changes" : "Add artifact set"}
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
          {artifacts.map((a) => (
            <div key={a._id} className="leaf-card rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sprout">{a.name}</div>
              </div>
              <button onClick={() => startEdit(a)} className="text-xs text-moss hover:text-bloom">
                Edit
              </button>
              <button onClick={() => handleDelete(a._id)} className="text-xs text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
