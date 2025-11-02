/*
  # Fix Profile Update Policy for Admins
  
  Problem: Admins cannot update other users' profiles (e.g., linking to employees)
  because the UPDATE policy only allows users to update their own profile.
  
  Solution: Add a policy that allows admins to update any profile.
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
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
