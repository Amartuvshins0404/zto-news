-- Fix RLS policies for translations table

-- Enable RLS (just in case)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON translations;
CREATE POLICY "Allow public read access" ON translations
  FOR SELECT USING (true);

-- Ensure authenticated users can still manage translations
DROP POLICY IF EXISTS "Allow authenticated insert" ON translations;
CREATE POLICY "Allow authenticated insert" ON translations
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON translations;
CREATE POLICY "Allow authenticated update" ON translations
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete" ON translations;
CREATE POLICY "Allow authenticated delete" ON translations
  FOR DELETE TO authenticated USING (true);
