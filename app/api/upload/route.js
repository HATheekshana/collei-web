import { NextResponse } from "next/server";

// Accepts multipart/form-data with a single "file" field, re-uploads it to
// ImgBB (same free host the Telegram bot already uses for card/guide images),
// and returns the resulting public URL. If IMGBB_API_KEY isn't configured,
// admins can still just paste an image URL directly in the form instead.
export async function POST(req) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "IMGBB_API_KEY is not configured on the server. Paste an image URL instead, or add a free key from https://api.imgbb.com/ to your .env."
      },
      { status: 400 }
    );
  }

  const incoming = await req.formData();
  const file = incoming.get("file");
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");

  const form = new URLSearchParams();
  form.set("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form
  });

  const data = await res.json();
  if (!data?.success) {
    return NextResponse.json(
      { error: data?.error?.message || "ImgBB upload failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: data.data.url });
}
