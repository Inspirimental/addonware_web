/*
  # Fix ambiguous column references in profile functions
  
  The functions had ambiguous column references where PL/pgSQL couldn't
  determine if 'id' referred to the parameter or the column.
  
  ## Changes
  
  1. Use explicit table aliases (p.id, not just id)
  2. Simplify is_admin() to avoid conflicts
  3. Fix list_profiles_with_email() and get_profile_with_email()
  
  ## Security
  
  - Maintains SECURITY DEFINER for RLS bypass
  - Access control remains strict
*/

-- Recreate is_admin() with simpler logic
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Recreate list_profiles_with_email with explicit table references
DROP FUNCTION IF EXISTS public.list_profiles_with_email() CASCADE;

CREATE OR REPLACE FUNCTION public.list_profiles_with_email()
RETURNS TABLE (
  id uuid,
  employee_id uuid,
  role user_role,
  created_at timestamptz,
  updated_at timestamptz,
  email varchar(255),
  email_confirmed_at timestamptz,
  employee_name text,
  employee_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  is_user_admin boolean;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  ) INTO is_user_admin;

  IF NOT is_user_admin THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.employee_id,
    p.role,
    p.created_at,
    p.updated_at,
    u.email::varchar(255),
    u.email_confirmed_at,
    e.name as employee_name,
    e.email as employee_email
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  LEFT JOIN employees e ON p.employee_id = e.id
  ORDER BY p.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_profiles_with_email() TO authenticated;

-- Recreate get_profile_with_email with explicit table references
DROP FUNCTION IF EXISTS public.get_profile_with_email(uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.get_profile_with_email(target_profile_id uuid)
RETURNS TABLE (
  id uuid,
  employee_id uuid,
  role user_role,
  created_at timestamptz,
  updated_at timestamptz,
  email varchar(255),
  email_confirmed_at timestamptz,
  employee_name text,
  employee_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  is_user_admin boolean;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = current_user_id AND p.role = 'admin'
  ) INTO is_user_admin;

  -- User must be admin or viewing their own profile
  IF NOT (is_user_admin OR current_user_id = target_profile_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.employee_id,
    p.role,
    p.created_at,
    p.updated_at,
    u.email::varchar(255),
    u.email_confirmed_at,
    e.name as employee_name,
    e.email as employee_email
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  LEFT JOIN employees e ON p.employee_id = e.id
  WHERE p.id = target_profile_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_profile_with_email(uuid) TO authenticated;
