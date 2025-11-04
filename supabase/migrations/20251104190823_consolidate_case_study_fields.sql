/*
  # Consolidate Case Study Fields

  ## Changes
  1. Migrate data from duplicate fields:
     - `teaser_short` → `challenge` (Herausforderung)
     - `solution_description` → `detailed_description` (will replace old detailed_description)
     - Drop `solution` field (no longer needed)
  
  2. Field cleanup:
     - Remove `teaser_short` column
     - Remove `solution` column
     - Remove `solution_description` column
  
  ## Migration Steps
  - Copy `teaser_short` to `challenge` (only if challenge is empty)
  - Copy `solution_description` to `detailed_description` (overwrite)
  - Drop unused columns

  ## Notes
  - Data is preserved by copying before dropping
  - Uses COALESCE to avoid overwriting existing data in challenge field
*/

-- Step 1: Migrate teaser_short to challenge (only if challenge is empty or null)
UPDATE case_studies
SET challenge = COALESCE(NULLIF(challenge, ''), teaser_short)
WHERE teaser_short IS NOT NULL AND teaser_short != '';

-- Step 2: Migrate solution_description to detailed_description (overwrite)
UPDATE case_studies
SET detailed_description = solution_description
WHERE solution_description IS NOT NULL AND solution_description != '';

-- Step 3: Drop the old duplicate columns
ALTER TABLE case_studies DROP COLUMN IF EXISTS teaser_short;
ALTER TABLE case_studies DROP COLUMN IF EXISTS solution;
ALTER TABLE case_studies DROP COLUMN IF EXISTS solution_description;