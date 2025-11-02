/*
  # Fix infinite recursion in profiles RLS policies
  
  The "Admins can view all profiles" policy was causing infinite recursion
  because it queries the profiles table while being evaluated on the profiles table.
  
  ## Changes
  
  1. Drop all existing policies on profiles table
  2. Create simplified policies that avoid recursion:
     - Users can view their own profile (using auth.uid() directly)
     - Users can update their own profile
     - Users can insert their own profile
     - Use a security definer function for admin checks to avoid recursion
  
  ## Security
  
  - All policies check authentication
  - Admin access is checked via a separate function to prevent recursion
  - Users can only modify their own profiles
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a security definer function to check if user is admin
-- This breaks the recursion by using a function with security definer
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get the role directly without triggering RLS
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Policy: Users can always view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy: Admins can view all profiles (using the helper function)
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Users can insert their own profile (needed for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Policy: Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin());
