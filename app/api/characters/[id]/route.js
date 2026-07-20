import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Character from "@/lib/models/Character";
import Guide from "@/lib/models/Guide";

export async function GET(_req, { params }) {
  await dbConnect();
  const character = await Character.findById(params.id).lean();
  if (!character) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(character);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Character.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const character = await Character.findByIdAndDelete(params.id);
  if (!character) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Guides are addressed by characterKey, not by a foreign key, so clean those up too.
  await Guide.deleteMany({ characterKey: character.characterKey });
  return NextResponse.json({ ok: true });
}
