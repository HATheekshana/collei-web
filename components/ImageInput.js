"use client";

import { useState } from "react";

export default function ImageInput({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-widest text-moss mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg px-3 py-2 text-sm"
          placeholder="https://... (paste an image URL)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="shrink-0 cursor-pointer text-xs border border-canopy-600 rounded-lg px-3 py-2 hover:border-bloom hover:text-bloom transition-colors">
          {uploading ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="mt-2 h-20 rounded-lg object-cover border border-canopy-600" />
      )}
    </div>
  );
}
