/*
  # Fix Search Path Injection in update_questionnaire_updated_at Function

  1. Changes
    - Add explicit `SET search_path = public, pg_temp` to the function
    - Prevents search path injection attacks
    - Ensures function always uses correct schema for built-in functions like now()
  
  2. Security
    - Mitigates search path injection vulnerability
    - Function now explicitly uses public schema and temporary schema only
    - No functional changes, only security hardening
*/

-- Recreate function with explicit search_path
CREATE OR REPLACE FUNCTION update_questionnaire_updated_at()
RETURNS TRIGGER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
