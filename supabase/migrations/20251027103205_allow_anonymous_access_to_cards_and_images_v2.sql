/*
  # Allow Anonymous Access to Cards and Images
  
  Problem: The public homepage tries to load service_cards and media_files,
  but RLS policies only allow authenticated users.
  
  Solution: Add policies for anonymous (anon) users to read active cards and all images.
  
  1. Add anon SELECT policy for service_cards (active cards only)
  2. Add anon SELECT policy for media_files (all images, as they're public assets)
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anonymous users can view active cards" ON service_cards;
  DROP POLICY IF EXISTS "Anonymous users can view all images" ON media_files;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Allow anonymous users to view active service cards
CREATE POLICY "Anonymous users can view active cards"
  ON service_cards
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow anonymous users to view all images (they're public assets)
CREATE POLICY "Anonymous users can view all images"
  ON media_files
  FOR SELECT
  TO anon
  USING (true);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
