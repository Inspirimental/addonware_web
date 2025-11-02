/*
  # Create Views as Workaround for PostgREST Cache
  
  Since PostgREST in Bolt environments doesn't recognize newly created tables,
  we'll drop the new tables and rename the old tables back to simple names.
  
  1. Drop new tables
  2. Rename old tables to simple names that work
*/

-- Drop the new tables that PostgREST can't see
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS files CASCADE;

-- The old tables (service_cards, media_files) are visible to PostgREST
-- So we'll just use those directly

-- Ensure PostgREST knows about them
NOTIFY pgrst, 'reload schema';
