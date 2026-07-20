import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Artifact from "@/lib/models/Artifact";

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Artifact.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const deleted = await Artifact.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
