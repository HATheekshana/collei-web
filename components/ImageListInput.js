"use client";

import ImageInput from "./ImageInput";

export default function ImageListInput({ label, values, onChange }) {
  const list = values || [];

  function updateAt(i, url) {
    const next = [...list];
    next[i] = url;
    onChange(next);
  }

  function removeAt(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-widest text-moss mb-1">{label}</label>
      )}
      <div className="space-y-2">
        {list.map((url, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <ImageInput value={url} onChange={(v) => updateAt(i, v)} />
            </div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="text-xs text-red-400 hover:text-red-300 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...list, ""])}
          className="text-xs border border-canopy-600 rounded-lg px-3 py-1.5 hover:border-bloom hover:text-bloom transition-colors"
        >
          + Add image
        </button>
      </div>
    </div>
  );
}
