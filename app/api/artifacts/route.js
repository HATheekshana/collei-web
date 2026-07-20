import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Artifact from "@/lib/models/Artifact";

export async function GET() {
  await dbConnect();
  const artifacts = await Artifact.find({}).sort({ name: 1 }).lean();
  return NextResponse.json(artifacts);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const created = await Artifact.create(body);
  return NextResponse.json(created, { status: 201 });
}
