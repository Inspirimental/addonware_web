/*
  # Fix Function Search Path Security Issues
  
  Security issue: Functions with mutable search_path can be vulnerable to attacks.
  
  Solution: Recreate all functions with SECURITY DEFINER and a fixed search_path.
  
  Functions to fix:
  - get_cards
  - get_active_cards
  - get_files
  - sync_public_employee_data (trigger function)
*/

-- Drop triggers first
DROP TRIGGER IF EXISTS sync_public_employee_data_trigger ON employees;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_cards();
DROP FUNCTION IF EXISTS public.get_active_cards();
DROP FUNCTION IF EXISTS public.get_files();
DROP FUNCTION IF EXISTS public.sync_public_employee_data();

-- Recreate get_cards with secure search_path
CREATE OR REPLACE FUNCTION public.get_cards()
RETURNS TABLE (
  id uuid,
  title text,
  subtitle text,
  teaser text,
  category text,
  icon text,
  background_image text,
  link_type text,
  link_value text,
  order_index integer,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.title,
    sc.subtitle,
    sc.teaser,
    sc.category,
    sc.icon,
    sc.background_image,
    sc.link_type,
    sc.link_value,
    sc.order_index,
    sc.is_active,
    sc.created_at,
    sc.updated_at
  FROM service_cards sc
  ORDER BY sc.order_index;
END;
$$;

-- Recreate get_active_cards with secure search_path
CREATE OR REPLACE FUNCTION public.get_active_cards()
RETURNS TABLE (
  id uuid,
  title text,
  subtitle text,
  teaser text,
  category text,
  icon text,
  background_image text,
  link_type text,
  link_value text,
  order_index integer,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.title,
    sc.subtitle,
    sc.teaser,
    sc.category,
    sc.icon,
    sc.background_image,
    sc.link_type,
    sc.link_value,
    sc.order_index,
    sc.is_active,
    sc.created_at,
    sc.updated_at
  FROM service_cards sc
  WHERE sc.is_active = true
  ORDER BY sc.order_index;
END;
$$;

-- Recreate get_files with secure search_path
CREATE OR REPLACE FUNCTION public.get_files()
RETURNS TABLE (
  id uuid,
  filename text,
  storage_path text,
  url text,
  alt_text text,
  size integer,
  mime_type text,
  uploaded_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mf.id,
    mf.filename,
    mf.storage_path,
    mf.url,
    mf.alt_text,
    mf.size,
    mf.mime_type,
    mf.uploaded_by,
    mf.created_at,
    mf.updated_at
  FROM media_files mf
  ORDER BY mf.created_at DESC;
END;
$$;

-- Recreate sync_public_employee_data as a TRIGGER function with secure search_path
CREATE OR REPLACE FUNCTION public.sync_public_employee_data()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete employees from public table that don't exist or are inactive in main table
  DELETE FROM employees_public ep
  WHERE NOT EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = ep.id AND e.is_active = true
  );
  
  -- Insert or update active employees in public table
  INSERT INTO employees_public (id, name, title, description, image_url, is_active, created_at, updated_at)
  SELECT 
    e.id,
    e.name,
    e.title,
    e.description,
    e.image_url,
    e.is_active,
    e.created_at,
    e.updated_at
  FROM employees e
  WHERE e.is_active = true
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger for employee sync
CREATE TRIGGER sync_public_employee_data_trigger
  AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH STATEMENT
  EXECUTE FUNCTION sync_public_employee_data();

-- Grant execute permissions to authenticated users for read functions
GRANT EXECUTE ON FUNCTION public.get_cards() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_active_cards() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_files() TO authenticated, anon;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
