export type Language = "zh" | "en" | "mixed";

export type AnalysisType =
  | "emotional_tone"
  | "themes"
  | "expression_style"
  | "language_comparison"
  | "relationship_changes";

export interface Letter {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
  updated_at: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  title: string | null;
  content: string;
  tags: string[];
  embedding?: number[] | null;
}

export interface LetterListItem {
  id: string;
  date: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  title: string | null;
  tags: string[];
}

export interface Analysis {
  id: string;
  letter_id: string;
  user_id: string;
  analysis_type: AnalysisType;
  content: string;
  created_at: string;
}

export interface SearchResult {
  id: string;
  date: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  title: string | null;
  content: string;
  tags: string[];
  similarity: number;
}

export interface LetterFormData {
  date: string;
  platform: string;
  sender: string;
  receiver: string;
  language: Language;
  title: string;
  content: string;
  tags: string[];
}
