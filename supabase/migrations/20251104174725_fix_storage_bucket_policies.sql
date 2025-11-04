/*
  # Fix Storage Bucket Policies

  1. Storage Setup
    - Ensure 'images' bucket exists and is public
    - Fix upload, read, and delete policies for authenticated users

  2. Security
    - Only authenticated users can upload files
    - Everyone can read files (public bucket)
    - Only admins and file owners can delete files
*/

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop all existing policies for the images bucket
DROP POLICY IF EXISTS "Allow image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Allow authenticated users to upload to images bucket
CREATE POLICY "Authenticated users can upload to images bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow everyone to read from images bucket (public bucket)
CREATE POLICY "Public read access to images bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to update their own files or admins to update any
CREATE POLICY "Users can update own files in images bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
)
WITH CHECK (
  bucket_id = 'images' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);

-- Allow authenticated users to delete their own files or admins to delete any
CREATE POLICY "Users can delete own files in images bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);
