/*
  # Extend Contact Requests for Case Study Unlocks

  1. Changes to contact_requests table
    - Extend CHECK constraint on request_type to include 'case_study_unlock'
    - This allows tracking case study unlock requests in the admin dashboard

  2. Security
    - Maintains existing RLS policies
    - No changes to data access patterns
*/

-- Drop existing check constraint
ALTER TABLE contact_requests
  DROP CONSTRAINT IF EXISTS contact_requests_request_type_check;

-- Add updated check constraint with case_study_unlock option
ALTER TABLE contact_requests
  ADD CONSTRAINT contact_requests_request_type_check
  CHECK (request_type = ANY (ARRAY['cv_download'::text, 'contact'::text, 'case_study_unlock'::text]));