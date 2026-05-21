import { createClient } from "@/lib/supabase/server";
import { analyzeLetter } from "@/lib/openai/analysis";
import { NextResponse } from "next/server";
import type { AnalysisType } from "@/types";

const VALID_TYPES: AnalysisType[] = [
  "emotional_tone",
  "themes",
  "expression_style",
  "language_comparison",
  "relationship_changes",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { analysis_type } = await request.json();

  if (!VALID_TYPES.includes(analysis_type)) {
    return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
  }

  // Check for existing cached analysis
  const { data: existing } = await supabase
    .from("analysis")
    .select("*")
    .eq("letter_id", id)
    .eq("analysis_type", analysis_type)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ analysis: existing, cached: true });
  }

  // Fetch letter content
  const { data: letter } = await supabase
    .from("letters")
    .select("content")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!letter) {
    return NextResponse.json({ error: "Letter not found" }, { status: 404 });
  }

  // Run analysis
  const analysisContent = await analyzeLetter(letter.content, analysis_type as AnalysisType);

  const { data: analysis, error } = await supabase
    .from("analysis")
    .insert({
      letter_id: id,
      user_id: user.id,
      analysis_type,
      content: analysisContent,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ analysis, cached: false });
}
