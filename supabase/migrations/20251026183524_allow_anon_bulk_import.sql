/*
  # Allow anonymous bulk image imports

  1. Changes
    - Allow public/anon role to insert images for bulk import script
    - This is a temporary measure for initial data seeding

  2. Security
    - Policy allows anon users to insert images with NULL uploaded_by
    - Should be removed or restricted after initial bulk import
*/

-- Allow anon users to insert images for bulk import
CREATE POLICY "Allow anon bulk image import"
  ON images FOR INSERT
  TO anon
  WITH CHECK (uploaded_by IS NULL);