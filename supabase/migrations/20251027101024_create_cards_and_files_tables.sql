/*
  # Create New Simple Tables
  
  Creating brand new tables with simple names to avoid PostgREST cache issues.
  
  1. New Tables
    - `cards` - Homepage service cards
    - `files` - Media file storage metadata
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin users
*/

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  teaser text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL DEFAULT 'FileText',
  background_image text NOT NULL,
  link_type text NOT NULL CHECK (link_type = ANY (ARRAY['service'::text, 'case-study'::text, 'external'::text, 'internal'::text])),
  link_value text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  url text NOT NULL,
  alt_text text,
  size integer NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cards
CREATE POLICY "Anyone can view active cards"
  ON cards FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all cards"
  ON cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete cards"
  ON cards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for files
CREATE POLICY "Anyone can view files"
  ON files FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can delete files"
  ON files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Copy data from service_cards to cards
INSERT INTO cards (id, title, subtitle, teaser, category, icon, background_image, link_type, link_value, order_index, is_active, created_at, updated_at)
SELECT id, title, subtitle, teaser, category, icon, background_image, link_type, link_value, order_index, is_active, created_at, updated_at
FROM service_cards
ON CONFLICT (id) DO NOTHING;

-- Copy data from media_files to files
INSERT INTO files (id, filename, storage_path, url, alt_text, size, mime_type, uploaded_by, created_at, updated_at)
SELECT id, filename, storage_path, url, alt_text, size, mime_type, uploaded_by, created_at, updated_at
FROM media_files
ON CONFLICT (id) DO NOTHING;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
