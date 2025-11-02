/*
  # Force PostgREST Schema Cache Reload
  
  This migration forces PostgREST to reload its schema cache by:
  1. Adding a dummy column to cards table
  2. Removing the dummy column immediately
  3. Sending multiple reload signals
  
  This is a workaround for PostgREST cache issues in managed environments.
*/

-- Add and immediately remove a dummy column to trigger schema change detection
DO $$ 
BEGIN
  ALTER TABLE cards ADD COLUMN IF NOT EXISTS _temp_reload_trigger text DEFAULT NULL;
  ALTER TABLE cards DROP COLUMN IF EXISTS _temp_reload_trigger;
  
  ALTER TABLE files ADD COLUMN IF NOT EXISTS _temp_reload_trigger text DEFAULT NULL;
  ALTER TABLE files DROP COLUMN IF EXISTS _temp_reload_trigger;
END $$;

-- Force multiple reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Wait a moment and signal again
DO $$
BEGIN
  PERFORM pg_sleep(0.5);
END $$;

NOTIFY pgrst, 'reload schema';
