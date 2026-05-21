import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/openai/embeddings";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "30");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const platform = searchParams.get("platform");
  const tag = searchParams.get("tag");

  let query = supabase
    .from("letters")
    .select("id, date, platform, sender, receiver, language, title, tags, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (year && month) {
    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = new Date(Number(year), Number(month), 0).toISOString().split("T")[0];
    query = query.gte("date", startDate).lte("date", endDate);
  } else if (year) {
    query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`);
  }

  if (platform) query = query.eq("platform", platform);
  if (tag) query = query.contains("tags", [tag]);

  const { data: letters, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    letters,
    total: count ?? 0,
    page,
    hasMore: (count ?? 0) > page * limit,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { date, platform, sender, receiver, language, title, content, tags } = body;

  if (!date || !content) {
    return NextResponse.json({ error: "Date and content are required" }, { status: 400 });
  }

  if (content.length > 100_000) {
    return NextResponse.json({ error: "Content too long" }, { status: 400 });
  }

  const { data: letter, error } = await supabase
    .from("letters")
    .insert({
      user_id: user.id,
      date,
      platform: platform || "notes",
      sender: sender || "",
      receiver: receiver || "",
      language: language || "zh",
      title: title || null,
      content,
      tags: tags || [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate embedding asynchronously — fire and forget pattern
  generateEmbedding(content)
    .then(async (embedding) => {
      await supabase
        .from("letters")
        .update({ embedding })
        .eq("id", letter.id);
    })
    .catch(() => {
      // Embedding generation failed — letter still saved without embedding
    });

  return NextResponse.json({ letter }, { status: 201 });
}
