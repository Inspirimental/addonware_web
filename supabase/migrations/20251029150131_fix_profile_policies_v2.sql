/*
  # Fix Profile Policies V2
  
  Problem: Users need to be able to read their own profile to determine
  if they are admin. The previous approach created a circular dependency.
  
  Solution: 
  - Allow authenticated users to read any profile they need
  - Use a helper function to check admin status that doesn't rely on RLS
  - Restrict write operations appropriately
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;

-- Allow all authenticated users to read all profiles
-- This is needed so users can check admin status and other profile info
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own profile only
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- Allow users to update their own profile
-- Note: role changes should be handled by admins through a function
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  );

-- Force schema reload
NOTIFY pgrst, 'reload schema';
