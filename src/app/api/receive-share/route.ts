import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title")?.toString() || "";
  const text = formData.get("text")?.toString() || "";
  const url = formData.get("url")?.toString() || "";

  // Encode the shared content into the redirect URL
  const combinedText = [title, text, url ? `\n\n${url}` : ""]
    .filter(Boolean)
    .join("\n\n");

  const encoded = encodeURIComponent(combinedText);

  // Redirect to import page with pre-filled content
  return NextResponse.redirect(
    new URL(`/import?shared=${encoded}`, request.url)
  );
}
