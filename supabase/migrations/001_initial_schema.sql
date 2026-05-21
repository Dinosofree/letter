-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Letters table
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  platform TEXT NOT NULL DEFAULT 'notes',
  sender TEXT NOT NULL DEFAULT '',
  receiver TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'zh'
    CHECK (language IN ('zh', 'en', 'mixed')),
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  embedding vector(1536)
);

-- Analysis table
CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_id UUID NOT NULL REFERENCES letters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'emotional_tone',
    'themes',
    'expression_style',
    'language_comparison',
    'relationship_changes'
  )),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(letter_id, analysis_type)
);

-- Indexes
CREATE INDEX idx_letters_user_date ON letters(user_id, date DESC);
CREATE INDEX idx_letters_user_platform ON letters(user_id, platform);
CREATE INDEX idx_letters_tags ON letters USING GIN(tags);
CREATE INDEX idx_letters_embedding ON letters
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_analysis_letter ON analysis(letter_id);
CREATE INDEX idx_analysis_user ON analysis(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_letters_updated_at
  BEFORE UPDATE ON letters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "letters_select_own" ON letters
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "letters_insert_own" ON letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "letters_update_own" ON letters
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "letters_delete_own" ON letters
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "analysis_select_own" ON analysis
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analysis_insert_own" ON analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analysis_delete_own" ON analysis
  FOR DELETE USING (auth.uid() = user_id);

-- Vector search function
CREATE OR REPLACE FUNCTION search_letters(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_user_id uuid DEFAULT NULL,
  filter_platform text DEFAULT NULL,
  filter_language text DEFAULT NULL,
  filter_date_from date DEFAULT NULL,
  filter_date_to date DEFAULT NULL,
  filter_tags text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  date date,
  platform text,
  sender text,
  receiver text,
  language text,
  title text,
  content text,
  tags text[],
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.user_id,
    l.date,
    l.platform,
    l.sender,
    l.receiver,
    l.language,
    l.title,
    l.content,
    l.tags,
    1 - (l.embedding <=> query_embedding) AS similarity
  FROM letters l
  WHERE
    (filter_user_id IS NULL OR l.user_id = filter_user_id)
    AND (filter_platform IS NULL OR l.platform = filter_platform)
    AND (filter_language IS NULL OR l.language = filter_language)
    AND (filter_date_from IS NULL OR l.date >= filter_date_from)
    AND (filter_date_to IS NULL OR l.date <= filter_date_to)
    AND (filter_tags IS NULL OR l.tags @> filter_tags)
    AND 1 - (l.embedding <=> query_embedding) > match_threshold
  ORDER BY l.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
