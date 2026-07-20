import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Endgame from "@/lib/models/Endgame";

const DEFAULTS = [
  { mode: "abyss", label: "Spiral Abyss" },
  { mode: "theatre", label: "Imaginarium Theater" },
  { mode: "stygian", label: "Stygian Onslaught" }
];

export async function GET() {
  await dbConnect();
  const docs = await Endgame.find({}).lean();
  const byMode = Object.fromEntries(docs.map((d) => [d.mode, d]));
  const merged = DEFAULTS.map((d) => byMode[d.mode] || d);
  return NextResponse.json(merged);
}

// Upsert by mode ("abyss" | "theatre" | "stygian"). Used by the admin panel.
export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  if (!body.mode) {
    return NextResponse.json({ error: "mode is required" }, { status: 400 });
  }
  const updated = await Endgame.findOneAndUpdate({ mode: body.mode }, body, {
    new: true,
    upsert: true,
    runValidators: true
  });
  return NextResponse.json(updated);
}
