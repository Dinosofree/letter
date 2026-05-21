import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/openai/embeddings";
import { synthesizeSearch } from "@/lib/openai/analysis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    query,
    limit = 10,
    threshold = 0.7,
    synthesize = true,
    filters,
  } = body;

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const embedding = await generateEmbedding(query);

  const { data: results, error } = await supabase.rpc("search_letters", {
    query_embedding: embedding,
    match_threshold: threshold,
    match_count: limit,
    filter_user_id: user.id,
    filter_platform: filters?.platform || null,
    filter_language: filters?.language || null,
    filter_date_from: filters?.dateFrom || null,
    filter_date_to: filters?.dateTo || null,
    filter_tags: filters?.tags || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let synthesis: string | null = null;
  if (synthesize && results && results.length > 0) {
    try {
      synthesis = await synthesizeSearch(
        query,
        results.map((r: { date: string; sender: string; receiver: string; content: string }) => ({
          date: r.date,
          sender: r.sender,
          receiver: r.receiver,
          content: r.content,
        }))
      );
    } catch {
      // Synthesis failed — return results without synthesis
    }
  }

  return NextResponse.json({
    results: results || [],
    synthesis,
  });
}
