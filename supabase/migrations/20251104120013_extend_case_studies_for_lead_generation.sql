/*
  # Extend Case Studies for Lead Generation

  1. Changes to case_studies table
    - Add `teaser_short` (TEXT) - Short teaser for overview cards (250-300 characters)
    - Add `problem_description` (TEXT) - Detailed problem description (always visible)
    - Add `solution_description` (TEXT) - Full solution description (visible after unlock)
    - Add `solution_locked` (BOOLEAN) - Controls if solution requires email unlock
    - Add `pdf_url` (TEXT, optional) - PDF download link (visible after unlock)

  2. Security
    - All fields are nullable to support existing data
    - Default values set for new entries
*/

-- Add new fields to case_studies table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'teaser_short'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN teaser_short TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'problem_description'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN problem_description TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'solution_description'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN solution_description TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'solution_locked'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN solution_locked BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'pdf_url'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN pdf_url TEXT;
  END IF;
END $$;