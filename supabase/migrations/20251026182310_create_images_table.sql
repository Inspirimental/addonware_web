/*
  # Create images table for media management

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `filename` (text) - Original filename
      - `storage_path` (text) - Path in Supabase Storage
      - `url` (text) - Public URL to the image
      - `alt_text` (text, nullable) - Alt text for accessibility
      - `size` (integer) - File size in bytes
      - `mime_type` (text) - MIME type (image/jpeg, image/png, etc.)
      - `uploaded_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `images` table
    - Authenticated users can read all images
    - Only authenticated users can upload images
    - Users can only delete their own uploaded images or admins can delete any
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  url text NOT NULL,
  alt_text text,
  size integer NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view all images
CREATE POLICY "Authenticated users can view all images"
  ON images FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own images, admins can update any
CREATE POLICY "Users can update own images or admins can update any"
  ON images FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can delete their own images, admins can delete any
CREATE POLICY "Users can delete own images or admins can delete any"
  ON images FOR DELETE
  TO authenticated
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_images_uploaded_by ON images(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);