/*
  # Fix security vulnerabilities in profiles view
  
  This migration addresses security issues:
  1. Removes the profiles_with_email view that exposed auth.users data
  2. Creates a secure function to fetch profile data with emails
  3. Restricts access to only what's necessary
  
  ## Changes
  
  1. Drop the insecure profiles_with_email view
  2. Create a security definer function that safely returns profile data
  3. Only expose email addresses to admins or the profile owner
  
  ## Security
  
  - No direct exposure of auth.users table
  - RLS policies are properly enforced
  - Only minimal data is exposed
  - Admins can see all profiles, users can see their own
*/

-- Drop the insecure view
DROP VIEW IF EXISTS profiles_with_email CASCADE;

-- Create a secure function to get profile with email
CREATE OR REPLACE FUNCTION public.get_profile_with_email(profile_id uuid)
RETURNS TABLE (
  id uuid,
  employee_id uuid,
  role user_role,
  created_at timestamptz,
  updated_at timestamptz,
  email text,
  email_confirmed_at timestamptz,
  employee_name text,
  employee_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin or requesting their own profile
  IF NOT (is_admin() OR auth.uid() = profile_id) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.employee_id,
    p.role,
    p.created_at,
    p.updated_at,
    u.email,
    u.email_confirmed_at,
    e.name as employee_name,
    e.email as employee_email
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  LEFT JOIN employees e ON p.employee_id = e.id
  WHERE p.id = profile_id;
END;
$$;

-- Create a secure function to list all profiles (admin only)
CREATE OR REPLACE FUNCTION public.list_profiles_with_email()
RETURNS TABLE (
  id uuid,
  employee_id uuid,
  role user_role,
  created_at timestamptz,
  updated_at timestamptz,
  email text,
  email_confirmed_at timestamptz,
  employee_name text,
  employee_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can list all profiles
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.employee_id,
    p.role,
    p.created_at,
    p.updated_at,
    u.email,
    u.email_confirmed_at,
    e.name as employee_name,
    e.email as employee_email
  FROM profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  LEFT JOIN employees e ON p.employee_id = e.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permissions only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profile_with_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_profiles_with_email() TO authenticated;

-- Revoke unnecessary permissions
REVOKE ALL ON FUNCTION public.get_profile_with_email(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.list_profiles_with_email() FROM anon;

-- Add comments
COMMENT ON FUNCTION public.get_profile_with_email(uuid) IS 
'Securely retrieves a single profile with email. Only accessible by admins or the profile owner.';

COMMENT ON FUNCTION public.list_profiles_with_email() IS 
'Securely retrieves all profiles with emails. Only accessible by admins.';
