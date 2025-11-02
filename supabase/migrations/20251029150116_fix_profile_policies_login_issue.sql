/*
  # Fix Profile Policies - Login Issue
  
  Problem: The current policies have a circular dependency issue where
  checking if a user is an admin requires reading from profiles, but
  reading from profiles requires checking admin status.
  
  Solution: Simplify policies to allow users to read their own profile
  and admins to read all profiles, without circular dependencies.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to view their own profile OR if they are admin, view all profiles
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR
    role = 'admin'
  );

-- Allow users to insert their own profile only
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- Allow users to update their own profile
-- Admins can update all profiles
CREATE POLICY "Users can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR
    role = 'admin'
  )
  WITH CHECK (
    id = (SELECT auth.uid())
    OR
    role = 'admin'
  );

-- Force schema reload
NOTIFY pgrst, 'reload schema';
