/*
  # Rename Tables to Working Names
  
  Renaming problematic tables that are not appearing in PostgREST schema cache
  to new names that should work with the Bolt-managed Supabase instance.
  
  1. Changes
    - Rename homepage_cards to service_cards
    - Rename images to media_files
    - All data, indexes, constraints, and RLS policies are preserved
*/

-- Rename homepage_cards to service_cards
ALTER TABLE IF EXISTS homepage_cards RENAME TO service_cards;

-- Rename images to media_files  
ALTER TABLE IF EXISTS images RENAME TO media_files;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
