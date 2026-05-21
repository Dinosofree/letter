import OpenAI from "openai";
import { ANALYSIS_PROMPTS } from "@/lib/prompts/analysis";
import type { AnalysisType } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeLetter(
  content: string,
  type: AnalysisType
): Promise<string> {
  const systemPrompt = ANALYSIS_PROMPTS[type];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content ?? "";
}

export async function synthesizeSearch(
  query: string,
  letters: { date: string; sender: string; receiver: string; content: string }[]
): Promise<string> {
  const formatted = letters
    .map(
      (l, i) =>
        `[${i + 1}] Date: ${l.date} | ${l.sender} → ${l.receiver}\n${l.content.slice(0, 800)}`
    )
    .join("\n\n---\n\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `A person searched their personal letter archive for: "${query}"
Below are the most relevant letters found, with dates and excerpts.

${formatted}

Please provide:
1. Key excerpts most relevant to the query (with dates)
2. Observable patterns across time
3. A concise summary

Stay grounded in what the letters actually say. Do not speculate beyond the text.
Use the same language as the query for your response.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content ?? "";
}
