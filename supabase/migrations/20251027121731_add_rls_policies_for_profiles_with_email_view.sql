/*
  # Add RLS policies for profiles_with_email view
  
  Enables Row Level Security on the profiles_with_email view and creates
  policies to allow authenticated admin users to view all profiles.
  
  1. Security
    - Enable RLS on profiles_with_email view
    - Add policy for admin users to view all profiles
*/

-- Note: Views don't support RLS directly, but we can create policies on the underlying tables
-- The view will respect the RLS policies of the base tables

-- Ensure profiles table has proper RLS policies for admin access
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  
  -- Create policy for admins to view all profiles
  CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
END $$;

-- Ensure employees can view their own profile
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  
  -- Create policy for users to view their own profile
  CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());
END $$;
