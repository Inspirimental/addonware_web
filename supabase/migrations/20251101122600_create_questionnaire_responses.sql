/*
  # Create Questionnaire Responses Schema

  1. New Tables
    - `questionnaire_responses`
      - `id` (uuid, primary key)
      - `questionnaire_id` (uuid, foreign key to questionnaires)
      - `email` (text) - Email of the person who filled out the questionnaire
      - `created_at` (timestamptz) - When the response was submitted
      - `updated_at` (timestamptz)

    - `questionnaire_answers`
      - `id` (uuid, primary key)
      - `response_id` (uuid, foreign key to questionnaire_responses)
      - `question_id` (uuid, foreign key to questionnaire_questions)
      - `option_id` (uuid, foreign key to questionnaire_options)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Anonymous users can insert their own responses (public submission)
    - Only admins can view all responses
    - Users cannot view other users' responses
*/

-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id uuid NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questionnaire_answers table
CREATE TABLE IF NOT EXISTS questionnaire_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL REFERENCES questionnaire_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES questionnaire_options(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_questionnaire ON questionnaire_responses(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_responses_email ON questionnaire_responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_created ON questionnaire_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_response ON questionnaire_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON questionnaire_answers(question_id);

-- Enable RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questionnaire_responses

-- Anonymous users can insert their own responses
CREATE POLICY "Anyone can submit questionnaire responses"
  ON questionnaire_responses FOR INSERT
  WITH CHECK (true);

-- Admins can view all responses
CREATE POLICY "Admins can view all responses"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete responses
CREATE POLICY "Admins can delete responses"
  ON questionnaire_responses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for questionnaire_answers

-- Anonymous users can insert answers for their responses
CREATE POLICY "Anyone can submit answers"
  ON questionnaire_answers FOR INSERT
  WITH CHECK (true);

-- Admins can view all answers
CREATE POLICY "Admins can view all answers"
  ON questionnaire_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete answers
CREATE POLICY "Admins can delete answers"
  ON questionnaire_answers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_updated_at();

-- Create view for response statistics
CREATE OR REPLACE VIEW questionnaire_response_stats AS
SELECT 
  q.id as questionnaire_id,
  q.slug,
  q.title,
  COUNT(DISTINCT qr.id) as response_count,
  MAX(qr.created_at) as last_response_at
FROM questionnaires q
LEFT JOIN questionnaire_responses qr ON q.id = qr.questionnaire_id
GROUP BY q.id, q.slug, q.title;

-- Grant access to the view for authenticated users
GRANT SELECT ON questionnaire_response_stats TO authenticated;
