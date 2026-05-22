import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/openai/embeddings";
import { synthesizeSearch } from "@/lib/openai/analysis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { query, format = "markdown", limit = 30 } = body;

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Search for matching letters
  const embedding = await generateEmbedding(query);

  const { data: results, error } = await supabase.rpc("search_letters", {
    query_embedding: embedding,
    match_threshold: 0.65, // lower threshold for broader recall
    match_count: limit,
    filter_user_id: user.id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!results || results.length === 0) {
    return NextResponse.json({
      error: "No matching letters found",
      content: null,
    });
  }

  // Generate synthesis
  const synthesis = await synthesizeSearch(
    query,
    results.map((r: { date: string; sender: string; receiver: string; content: string }) => ({
      date: r.date,
      sender: r.sender,
      receiver: r.receiver,
      content: r.content,
    }))
  );

  // Build memory document
  const sorted = [...results].sort(
    (a: { date: string }, b: { date: string }) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (format === "markdown" || format === "md") {
    const lines: string[] = [
      `# 记忆文档`,
      ``,
      `> 检索主题: ${query}`,
      `> 生成时间: ${new Date().toLocaleDateString("zh-CN")}`,
      `> 匹配信件: ${results.length} 封`,
      ``,
      `---`,
      ``,
      `## AI 综合回顾`,
      ``,
      synthesis,
      ``,
      `---`,
      ``,
      `## 原文片段`,
      ``,
    ];

    for (const r of sorted) {
      const d = r.date as string;
      const s = r.sender as string;
      const rc = r.receiver as string;
      const c = r.content as string;
      const p = r.platform as string;

      lines.push(`### ${d}  ·  ${s || "?"} → ${rc || "?"}  ·  ${p}`);
      lines.push(``);
      lines.push(
        c.length > 1200
          ? c.slice(0, 1200) + "\n\n*...（内容过长，已截断）*"
          : c
      );
      lines.push(``);
      lines.push(`---`);
      lines.push(``);
    }

    return NextResponse.json({
      content: lines.join("\n"),
      format: "markdown",
      count: results.length,
    });
  }

  // Plain text format
  const txtLines: string[] = [
    `记忆文档`,
    `检索主题: ${query}`,
    `生成时间: ${new Date().toLocaleDateString("zh-CN")}`,
    `匹配信件: ${results.length} 封`,
    ``,
    `--- AI 综合回顾 ---`,
    synthesis,
    `--- 原文片段 ---`,
  ];

  for (const r of sorted) {
    txtLines.push(`${r.date} | ${r.sender} → ${r.receiver} | ${r.platform}`);
    txtLines.push(r.content);
    txtLines.push(`---`);
  }

  return NextResponse.json({
    content: txtLines.join("\n\n"),
    format: "txt",
    count: results.length,
  });
}
