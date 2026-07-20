import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Boss from "@/lib/models/Boss";

export async function GET(_req, { params }) {
  await dbConnect();
  const boss = await Boss.findById(params.id).lean();
  if (!boss) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(boss);
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updated = await Boss.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const deleted = await Boss.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
