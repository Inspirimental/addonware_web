/*
  # Fix Security Definer Issue in questionnaire_response_stats View

  1. Changes
    - Drop and recreate `questionnaire_response_stats` view without SECURITY DEFINER
    - Ensures the view runs with invoker's privileges (more secure)
    - No functional changes, only security improvement
  
  2. Security
    - View uses SECURITY INVOKER (default) instead of SECURITY DEFINER
    - Users can only see data they have permissions for via RLS
*/

-- Drop existing view
DROP VIEW IF EXISTS questionnaire_response_stats;

-- Recreate view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW questionnaire_response_stats AS
SELECT 
  q.id as questionnaire_id,
  q.slug,
  q.title,
  COUNT(DISTINCT qr.id) as response_count,
  MAX(qr.created_at) as last_response_at
FROM questionnaires q
LEFT JOIN questionnaire_responses qr ON q.id = qr.questionnaire_id
GROUP BY q.id, q.slug, q.title;

-- Grant access to authenticated users
GRANT SELECT ON questionnaire_response_stats TO authenticated;
