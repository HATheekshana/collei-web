import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Guide from "@/lib/models/Guide";

export async function GET(req) {
  await dbConnect();
  const characterKey = req.nextUrl.searchParams.get("characterKey");
  const filter = characterKey ? { characterKey } : {};
  const guides = await Guide.find(filter).sort({ name: 1 }).lean();
  return NextResponse.json(guides);
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
  const created = await Guide.create(body);
  return NextResponse.json(created, { status: 201 });
}
