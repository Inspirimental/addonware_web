/*
  # Add Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key to employees_public, optional)
      - `requester_name` (text)
      - `requester_email` (text)
      - `requester_organization` (text, optional)
      - `message` (text)
      - `request_type` (text: 'cv_download' or 'contact')
      - `created_at` (timestamptz)

  2. Changes
    - Migrate existing cv_download_requests data to new unified table
    - Keep cv_download_requests for backwards compatibility

  3. Security
    - Enable RLS on `contact_requests` table
    - Add policy for authenticated users (admins) to read all requests
    - Add policy for anonymous users to insert their own requests
*/

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees_public(id) ON DELETE CASCADE,
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_organization text DEFAULT '',
  message text DEFAULT '',
  request_type text NOT NULL CHECK (request_type IN ('cv_download', 'contact')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert contact requests"
  ON contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_requests_employee_id ON contact_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_type ON contact_requests(request_type);

-- Migrate existing CV download requests to new table
INSERT INTO contact_requests (id, employee_id, requester_name, requester_email, requester_organization, message, request_type, created_at)
SELECT id, employee_id, requester_name, requester_email, requester_organization, '', 'cv_download', created_at
FROM cv_download_requests
ON CONFLICT (id) DO NOTHING;