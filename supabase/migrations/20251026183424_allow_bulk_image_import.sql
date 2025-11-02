/*
  # Allow bulk image imports

  1. Changes
    - Temporarily allow inserts with NULL uploaded_by for bulk imports
    - This is needed for initial data seeding

  2. Security
    - This policy allows any authenticated user to insert images with NULL uploaded_by
    - Should be used only for initial bulk imports
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Authenticated users can upload images" ON images;

-- Create new policy that allows NULL uploaded_by
CREATE POLICY "Authenticated users can upload images"
  ON images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by OR uploaded_by IS NULL);