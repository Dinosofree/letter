import type { Language, AnalysisType } from "@/types";

export const PLATFORMS = [
  "slowly",
  "gmail",
  "wechat",
  "notes",
  "other",
] as const;

export const PLATFORM_LABELS: Record<string, string> = {
  slowly: "Slowly",
  gmail: "Gmail",
  wechat: "微信",
  notes: "Notes",
  other: "其他",
};

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "mixed", label: "中英混合" },
];

export const ANALYSIS_TYPES: { value: AnalysisType; label: string }[] = [
  { value: "emotional_tone", label: "情绪氛围" },
  { value: "themes", label: "长期主题" },
  { value: "expression_style", label: "表达方式" },
  { value: "language_comparison", label: "中英文差异" },
  { value: "relationship_changes", label: "关系变化" },
];

export const PAGE_SIZE = 30;
