/*
  # Fix storage policies for anon uploads

  1. Changes
    - Allow anon users to upload to storage bucket for bulk import
    - This is needed for the upload script to work

  2. Security
    - Temporary measure for bulk import
    - Should be restricted after initial data seeding
*/

-- Drop existing storage upload policy
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Allow both authenticated and anon users to upload
CREATE POLICY "Allow image uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');