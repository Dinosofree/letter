import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/openai/embeddings";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: letter, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: analyses } = await supabase
    .from("analysis")
    .select("*")
    .eq("letter_id", id)
    .eq("user_id", user.id);

  return NextResponse.json({ letter, analyses: analyses || [] });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { date, platform, sender, receiver, language, title, content, tags } = body;

  const updates: Record<string, unknown> = {};
  if (date !== undefined) updates.date = date;
  if (platform !== undefined) updates.platform = platform;
  if (sender !== undefined) updates.sender = sender;
  if (receiver !== undefined) updates.receiver = receiver;
  if (language !== undefined) updates.language = language;
  if (title !== undefined) updates.title = title;
  if (content !== undefined) {
    if (content.length > 100_000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }
    updates.content = content;
  }
  if (tags !== undefined) updates.tags = tags;

  const { data: letter, error } = await supabase
    .from("letters")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Regenerate embedding if content changed
  if (content !== undefined) {
    generateEmbedding(content)
      .then(async (embedding) => {
        await supabase.from("letters").update({ embedding }).eq("id", id);
      })
      .catch(() => {});
  }

  return NextResponse.json({ letter });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
