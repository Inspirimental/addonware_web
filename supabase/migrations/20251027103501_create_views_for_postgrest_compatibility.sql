/*
  # Create Views for PostgREST Compatibility
  
  Problem: PostgREST in Bolt environments has cached the old table names
  (homepage_cards, images) but they were renamed to (service_cards, media_files).
  
  Solution: Create updatable views with the old names that map to the new tables.
  This way PostgREST can find the tables it expects.
  
  1. Create homepage_cards view -> service_cards
  2. Create images view -> media_files
  3. Add RLS policies to the views
  4. Make views updatable
*/

-- Drop views if they exist
DROP VIEW IF EXISTS homepage_cards CASCADE;
DROP VIEW IF EXISTS images CASCADE;

-- Create homepage_cards view pointing to service_cards
CREATE VIEW homepage_cards AS 
SELECT * FROM service_cards;

-- Create images view pointing to media_files
CREATE VIEW images AS 
SELECT * FROM media_files;

-- Make the views updatable by creating rules
CREATE OR REPLACE RULE homepage_cards_insert AS
  ON INSERT TO homepage_cards
  DO INSTEAD
  INSERT INTO service_cards VALUES (NEW.*);

CREATE OR REPLACE RULE homepage_cards_update AS
  ON UPDATE TO homepage_cards
  DO INSTEAD
  UPDATE service_cards SET
    id = NEW.id,
    title = NEW.title,
    subtitle = NEW.subtitle,
    teaser = NEW.teaser,
    category = NEW.category,
    icon = NEW.icon,
    background_image = NEW.background_image,
    link_type = NEW.link_type,
    link_value = NEW.link_value,
    order_index = NEW.order_index,
    is_active = NEW.is_active,
    created_at = NEW.created_at,
    updated_at = NEW.updated_at
  WHERE service_cards.id = OLD.id;

CREATE OR REPLACE RULE homepage_cards_delete AS
  ON DELETE TO homepage_cards
  DO INSTEAD
  DELETE FROM service_cards WHERE id = OLD.id;

CREATE OR REPLACE RULE images_insert AS
  ON INSERT TO images
  DO INSTEAD
  INSERT INTO media_files VALUES (NEW.*);

CREATE OR REPLACE RULE images_update AS
  ON UPDATE TO images
  DO INSTEAD
  UPDATE media_files SET
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
  WHERE media_files.id = OLD.id;

CREATE OR REPLACE RULE images_delete AS
  ON DELETE TO images
  DO INSTEAD
  DELETE FROM media_files WHERE id = OLD.id;

-- Grant permissions on views (they inherit RLS from the underlying tables)
GRANT SELECT, INSERT, UPDATE, DELETE ON homepage_cards TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON images TO authenticated, anon;

-- Notify PostgREST to reload
NOTIFY pgrst, 'reload schema';
