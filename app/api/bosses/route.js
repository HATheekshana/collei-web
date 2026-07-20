import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Boss from "@/lib/models/Boss";

export async function GET() {
  await dbConnect();
  const bosses = await Boss.find({}).sort({ name: 1 }).lean();
  return NextResponse.json(bosses);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const created = await Boss.create(body);
  return NextResponse.json(created, { status: 201 });
}
