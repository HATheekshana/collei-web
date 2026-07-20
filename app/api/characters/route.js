import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Character from "@/lib/models/Character";

export async function GET() {
  await dbConnect();
  const characters = await Character.find({}).sort({ name: 1 }).lean();
  return NextResponse.json(characters);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  if (!body.name || !body.characterKey || !body.imageUrl) {
    return NextResponse.json(
      { error: "name, characterKey and imageUrl are required" },
      { status: 400 }
    );
  }

  try {
    const created = await Character.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
