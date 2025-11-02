/*
  # Fix is_admin() function and list_profiles_with_email()
  
  The is_admin() function was failing because it was being blocked by RLS policies,
  creating a circular dependency. This migration fixes both the is_admin() function
  and the list_profiles_with_email() function.
  
  ## Changes
  
  1. Fix is_admin() to bypass RLS by using SECURITY DEFINER properly
  2. Fix type mismatch in list_profiles_with_email() (varchar vs text)
  3. Ensure functions work correctly for admin users
  
  ## Security
  
  - Functions use SECURITY DEFINER to bypass RLS only where necessary
  - Proper access control is maintained
  - Type casting ensures compatibility
*/

-- Drop and recreate is_admin() function with proper RLS bypass
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
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Recreate list_profiles_with_email with correct types
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
BEGIN
  -- Check if user is admin
  IF NOT (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  ) THEN
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

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.list_profiles_with_email() TO authenticated;

-- Recreate get_profile_with_email with correct types
DROP FUNCTION IF EXISTS public.get_profile_with_email(uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.get_profile_with_email(profile_id uuid)
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
BEGIN
  -- Check if user is admin or requesting their own profile
  IF NOT (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR auth.uid() = profile_id
  ) THEN
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
  WHERE p.id = profile_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profile_with_email(uuid) TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION public.is_admin() IS 
'Returns true if the current user has admin role. Uses SECURITY DEFINER to bypass RLS.';

COMMENT ON FUNCTION public.list_profiles_with_email() IS 
'Lists all profiles with email addresses. Only accessible by admin users.';

COMMENT ON FUNCTION public.get_profile_with_email(uuid) IS 
'Gets a single profile with email. Accessible by admins or the profile owner.';
