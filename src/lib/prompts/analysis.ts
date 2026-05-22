import type { AnalysisType } from "@/types";

const BASE_CONSTRAINT =
  "Be restrained. Do not diagnose, therapize, or over-interpret. " +
  "Use the same language as the source text for your response. " +
  "You are a quiet, thoughtful reader of personal letters.";

export const ANALYSIS_PROMPTS: Record<AnalysisType, string> = {
  emotional_tone:
    `Describe the emotional tone and mood of this letter. ` +
    `Note any mood shifts, the overall emotional register (restrained, warm, anxious, etc.), ` +
    `and what specific phrases convey the emotional state. Avoid clinical or psychological terminology. ` +
    BASE_CONSTRAINT,

  themes:
    `Identify 3-5 recurring themes in this letter. ` +
    `For each theme, provide a brief description and a supporting quote from the letter. ` +
    `Focus on what the writer cares about, returns to, or emphasizes. ` +
    BASE_CONSTRAINT,

  expression_style:
    `Analyze the writing style of this letter. ` +
    `Comment on: sentence structure, vocabulary level, use of metaphor or imagery, ` +
    `level of formality, and distinctive voice characteristics. ` +
    `Be descriptive, not evaluative — describe how the writer writes, not how well. ` +
    BASE_CONSTRAINT,

  language_comparison:
    `Analyze how the writer uses different languages in this letter. ` +
    `Note any code-switching patterns, differences in emotional expression between languages, ` +
    `and cultural nuances that emerge in each language. ` +
    `If the letter is primarily in one language, note what that choice reveals. ` +
    BASE_CONSTRAINT,

  relationship_changes:
    `Analyze the writer-recipient dynamics visible in this letter. ` +
    `Note: degree of warmth or distance, level of formality, intimacy cues, ` +
    `power dynamics or equality signals, and any notable shifts in the relationship tone. ` +
    `Stay grounded in the text — only describe what the words reveal. ` +
    BASE_CONSTRAINT,
};

export function getSearchSynthesisPrompt(query: string, letters: string): string {
  return `A person searched their personal letter archive for: "${query}"

Below are the most relevant letters found, with dates and excerpts. The letters may contain both Chinese and English text. Be attentive to expressions in both languages.

${letters}

Please provide:
1. **Key excerpts** most relevant to the query — include dates and the original language. Quote directly.
2. **Patterns across time** — what changes, what recurs, what shifts can be observed from the letters.
3. **Emotional contour** (only if evident) — the emotional tone and its evolution across these fragments. Do not fabricate.
4. **A concise summary** synthesizing the above.

Important:
- Stay grounded in what the letters actually say.
- Do not speculate beyond the text.
- If both Chinese and English appear, reflect both in your analysis.
- Use the same language as the query for your response.
- Be restrained, not forensic.`;
}

export function getMemoryDocPrompt(query: string, letters: string): string {
  return `A person wants to create a "memory document" from their personal letter archive.

Search theme: "${query}"

Below are the matching letters, sorted chronologically:

${letters}

Create a reflective, archival-style memory document that:

1. Opens with a brief reflection on the search theme — what it means in the context of the writer's life
2. Traces the theme through the letters chronologically, noting key moments and quotes
3. Notes shifts in tone, perspective, or expression over time
4. Ends with a quiet, non-evaluative closing thought

Guidelines:
- Preserve original language of quotes (both Chinese and English)
- Write in the same language as the search query
- Be grounding, not grandiose
- This is a personal archive document, not a clinical report`;
}
