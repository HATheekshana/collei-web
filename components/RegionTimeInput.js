"use client";

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}

export default function RegionTimeInput({ label, value, onChange }) {
  const regions = ["Asia", "EU", "NA"];
  const times = value || {};

  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-widest text-moss mb-1">{label}</label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {regions.map((region) => (
          <div key={region}>
            <span className="text-[10px] text-parchment/40">{region}</span>
            <input
              type="datetime-local"
              className="w-full rounded-lg px-2 py-1.5 text-sm"
              value={toLocalInputValue(times[region])}
              onChange={(e) =>
                onChange({ ...times, [region]: toIso(e.target.value) })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
