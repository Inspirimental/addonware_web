/*
  # Create Questionnaires Schema

  1. New Tables
    - `questionnaires`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier (digitalisierung, fuehrung, struktur)
      - `title` (text) - Display title for the questionnaire
      - `description` (text) - Description shown on the questionnaire page
      - `is_active` (boolean) - Whether the questionnaire is currently available
      - `sort_order` (integer) - For ordering in admin interface
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `questionnaire_questions`
      - `id` (uuid, primary key)
      - `questionnaire_id` (uuid, foreign key to questionnaires)
      - `question_text` (text) - The question to ask
      - `sort_order` (integer) - Order of questions in the questionnaire
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `questionnaire_options`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key to questionnaire_questions)
      - `option_text` (text) - The answer option text
      - `sort_order` (integer) - Order of options for the question
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Authenticated users can read all questionnaires (for display)
    - Anonymous users can read active questionnaires (public access)
    - Only admins can insert/update/delete questionnaires and questions
*/

-- Create questionnaires table
CREATE TABLE IF NOT EXISTS questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questionnaire_questions table
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id uuid NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questionnaire_options table
CREATE TABLE IF NOT EXISTS questionnaire_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questionnaires_slug ON questionnaires(slug);
CREATE INDEX IF NOT EXISTS idx_questionnaires_active ON questionnaires(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_questionnaire ON questionnaire_questions(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_options_question ON questionnaire_options(question_id);

-- Enable RLS
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_options ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questionnaires
CREATE POLICY "Anyone can view active questionnaires"
  ON questionnaires FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all questionnaires"
  ON questionnaires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert questionnaires"
  ON questionnaires FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update questionnaires"
  ON questionnaires FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete questionnaires"
  ON questionnaires FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for questionnaire_questions
CREATE POLICY "Anyone can view questions of active questionnaires"
  ON questionnaire_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questionnaires
      WHERE questionnaires.id = questionnaire_questions.questionnaire_id
      AND questionnaires.is_active = true
    )
  );

CREATE POLICY "Authenticated users can view all questions"
  ON questionnaire_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON questionnaire_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update questions"
  ON questionnaire_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete questions"
  ON questionnaire_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for questionnaire_options
CREATE POLICY "Anyone can view options of active questionnaires"
  ON questionnaire_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questionnaire_questions
      INNER JOIN questionnaires ON questionnaires.id = questionnaire_questions.questionnaire_id
      WHERE questionnaire_questions.id = questionnaire_options.question_id
      AND questionnaires.is_active = true
    )
  );

CREATE POLICY "Authenticated users can view all options"
  ON questionnaire_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert options"
  ON questionnaire_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update options"
  ON questionnaire_options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete options"
  ON questionnaire_options FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_questionnaire_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_updated_at();

CREATE TRIGGER update_questionnaire_questions_updated_at
  BEFORE UPDATE ON questionnaire_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_updated_at();

CREATE TRIGGER update_questionnaire_options_updated_at
  BEFORE UPDATE ON questionnaire_options
  FOR EACH ROW
  EXECUTE FUNCTION update_questionnaire_updated_at();
