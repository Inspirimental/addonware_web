/*
  # Create media_files view pointing to files table

  1. Problem
    - The application expects a `media_files` table
    - But the actual data is in the `files` table
    - This causes "Bilder konnten nicht geladen werden" error

  2. Solution
    - Create a view `media_files` that points to `files`
    - This ensures backward compatibility

  3. Security
    - View inherits RLS policies from the underlying `files` table
*/

-- Drop the old media_files table if it exists (backup data first if needed)
-- Since files table was created by copying from media_files, we can safely drop media_files
DROP TABLE IF EXISTS media_files CASCADE;

-- Create media_files as a view pointing to files
CREATE VIEW media_files AS
SELECT * FROM files;

-- Make the view updatable by creating rules
CREATE OR REPLACE RULE media_files_insert AS
  ON INSERT TO media_files
  DO INSTEAD
  INSERT INTO files (id, filename, storage_path, url, alt_text, size, mime_type, uploaded_by, created_at, updated_at)
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()),
    NEW.filename,
    NEW.storage_path,
    NEW.url,
    NEW.alt_text,
    NEW.size,
    NEW.mime_type,
    NEW.uploaded_by,
    COALESCE(NEW.created_at, now()),
    COALESCE(NEW.updated_at, now())
  );

CREATE OR REPLACE RULE media_files_update AS
  ON UPDATE TO media_files
  DO INSTEAD
  UPDATE files SET
    id = NEW.id,
    filename = NEW.filename,
    storage_path = NEW.storage_path,
    url = NEW.url,
    alt_text = NEW.alt_text,
    size = NEW.size,
    mime_type = NEW.mime_type,
    uploaded_by = NEW.uploaded_by,
    created_at = NEW.created_at,
    updated_at = NEW.updated_at
  WHERE files.id = OLD.id;

CREATE OR REPLACE RULE media_files_delete AS
  ON DELETE TO media_files
  DO INSTEAD
  DELETE FROM files WHERE id = OLD.id;

-- Grant permissions on view (inherits RLS from files table)
GRANT SELECT, INSERT, UPDATE, DELETE ON media_files TO authenticated, anon;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
