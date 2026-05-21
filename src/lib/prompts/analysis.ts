import type { AnalysisType } from "@/types";

const BASE_CONSTRAINT =
  "Be restrained. Do not diagnose, therapize, or over-interpret. " +
  "Use the same language as the letter for your response. " +
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
