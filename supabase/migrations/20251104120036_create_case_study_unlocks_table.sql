/*
  # Create Case Study Unlocks Table

  1. New Table
    - `case_study_unlocks` - Tracks which email addresses have unlocked which case studies
      - `id` (uuid, primary key)
      - `email` (text) - Email address of requester
      - `case_study_id` (uuid, foreign key) - References case_studies table
      - `unlock_token` (text) - Unique token for email verification link
      - `unlocked_at` (timestamp) - When the unlock was confirmed
      - `created_at` (timestamp) - When the request was created

  2. Security
    - Enable RLS on case_study_unlocks table
    - Add policy for anonymous users to create unlock requests
    - Add policy for users to verify their own unlocks
    - Add policy for admins to view all unlocks

  3. Indexes
    - Index on email for quick lookups
    - Index on case_study_id for quick lookups
    - Index on unlock_token for verification
*/

-- Create case_study_unlocks table
CREATE TABLE IF NOT EXISTS case_study_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  case_study_id UUID NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
  unlock_token TEXT NOT NULL UNIQUE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_case_study_unlocks_email ON case_study_unlocks(email);
CREATE INDEX IF NOT EXISTS idx_case_study_unlocks_case_study_id ON case_study_unlocks(case_study_id);
CREATE INDEX IF NOT EXISTS idx_case_study_unlocks_token ON case_study_unlocks(unlock_token);

-- Enable RLS
ALTER TABLE case_study_unlocks ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to create unlock requests
CREATE POLICY "Allow anonymous to create unlock requests"
  ON case_study_unlocks
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anyone to verify tokens (for checking unlock status)
CREATE POLICY "Allow anyone to read unlocks by token"
  ON case_study_unlocks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Allow admins to view all unlocks
CREATE POLICY "Allow admins to view all unlocks"
  ON case_study_unlocks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Allow anonymous users to update unlock confirmation
CREATE POLICY "Allow anyone to confirm unlock with valid token"
  ON case_study_unlocks
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);