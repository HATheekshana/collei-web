import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Banner from "@/lib/models/Banner";

export async function GET() {
  await dbConnect();
  const banner = await Banner.findOne({ key: "singleton" }).lean();
  return NextResponse.json(
    banner || {
      currentCharacters: [],
      currentIcons: [],
      currentEnd: {},
      nextCharacters: [],
      nextIcons: [],
      nextStart: {},
      specialEventName: null,
      specialEventStart: {}
    }
  );
}

export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await Banner.findOneAndUpdate({ key: "singleton" }, body, {
    new: true,
    upsert: true,
    runValidators: true
  });
  return NextResponse.json(updated);
}
