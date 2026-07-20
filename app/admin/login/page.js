"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push(params.get("next") || "/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="font-display text-3xl text-parchment mb-1 text-center">Keeper Login</h1>
      <p className="text-parchment/50 text-sm text-center mb-8">
        Sign in to manage the grove's almanac.
      </p>
      <form onSubmit={handleSubmit} className="leaf-card rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">Username</label>
          <input
            className="w-full rounded-lg px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-moss mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-moss text-canopy-950 font-medium py-2.5 rounded-full hover:bg-sprout transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
