-- Migration: Create translations table
-- Run this in Supabase Dashboard > SQL Editor

-- Create translations table for multi-language support
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_lang_key UNIQUE(lang_code, key)
);

-- Create index for fast lookups by language
CREATE INDEX IF NOT EXISTS idx_translations_lang ON translations(lang_code);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON translations
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert" ON translations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON translations
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON translations
  FOR DELETE TO authenticated USING (true);
