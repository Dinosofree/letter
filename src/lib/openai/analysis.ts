import OpenAI from "openai";
import { ANALYSIS_PROMPTS, getSearchSynthesisPrompt, getMemoryDocPrompt } from "@/lib/prompts/analysis";
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

type LetterSnippet = {
  date: string;
  sender: string;
  receiver: string;
  content: string;
  platform?: string;
};

function formatLetters(letters: LetterSnippet[]): string {
  return letters
    .map(
      (l, i) =>
        `[${i + 1}] Date: ${l.date} | ${l.sender || "?"} → ${l.receiver || "?"} | ${l.platform || ""}\n${l.content.slice(0, 1000)}`
    )
    .join("\n\n---\n\n");
}

export async function synthesizeSearch(
  query: string,
  letters: LetterSnippet[]
): Promise<string> {
  const formatted = formatLetters(letters);
  const systemPrompt = getSearchSynthesisPrompt(query, formatted);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response.choices[0].message.content ?? "";
}

export async function generateMemoryDoc(
  query: string,
  letters: LetterSnippet[]
): Promise<string> {
  const formatted = formatLetters(letters);
  const systemPrompt = getMemoryDocPrompt(query, formatted);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0].message.content ?? "";
}
