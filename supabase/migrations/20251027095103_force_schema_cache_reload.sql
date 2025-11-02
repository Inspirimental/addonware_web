/*
  # Force Schema Cache Reload
  
  This migration forces PostgREST to reload its schema cache by making
  a trivial change to the schema. This is necessary when new tables
  are not appearing in the API despite existing in the database.
  
  1. Changes
    - Add a comment to the homepage_cards table to force schema reload
    - Add a comment to the images table to force schema reload
*/

-- Force schema cache reload by adding comments
COMMENT ON TABLE public.homepage_cards IS 'Homepage service cards for dynamic content display';
COMMENT ON TABLE public.images IS 'Image storage metadata and references';

-- Explicitly notify PostgREST to reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
