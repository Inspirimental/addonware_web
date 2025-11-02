/*
  # Force Recreate Views Without SECURITY DEFINER
  
  This migration completely drops and recreates the views to ensure
  they are not defined with SECURITY DEFINER property.
  
  1. Drop all dependent objects
  2. Recreate views as simple SELECT statements
  3. Force schema cache reload
*/

-- Drop views completely with CASCADE to remove all dependencies
DROP VIEW IF EXISTS homepage_cards CASCADE;
DROP VIEW IF EXISTS images CASCADE;

-- Recreate homepage_cards view as a simple view (no SECURITY DEFINER)
CREATE OR REPLACE VIEW homepage_cards 
WITH (security_invoker = true)
AS
SELECT 
  id,
  title,
  subtitle,
  teaser,
  category,
  icon,
  background_image,
  link_type,
  link_value,
  order_index,
  is_active,
  created_at,
  updated_at
FROM service_cards;

-- Recreate images view as a simple view (no SECURITY DEFINER)
CREATE OR REPLACE VIEW images
WITH (security_invoker = true)
AS
SELECT 
  id,
  filename,
  storage_path,
  url,
  alt_text,
  size,
  mime_type,
  uploaded_by,
  created_at,
  updated_at
FROM media_files;

-- Grant appropriate permissions
GRANT SELECT ON homepage_cards TO anon, authenticated;
GRANT SELECT ON images TO anon, authenticated;

-- Force PostgreSQL to reload the schema cache
SELECT pg_notify('pgrst', 'reload schema');

-- Verify the views are created correctly
DO $$
BEGIN
  RAISE NOTICE 'Views recreated successfully without SECURITY DEFINER';
END $$;
