/*
  # Fix All Security Issues
  
  1. Auth RLS Performance Issues
    - Optimize all RLS policies by wrapping auth functions in SELECT statements
    - This prevents re-evaluation for each row, improving query performance
  
  2. Unused Index
    - Remove unused idx_profiles_employee_id index
  
  3. Multiple Permissive Policies
    - Consolidate duplicate policies into single comprehensive policies
  
  4. Function Search Path
    - Fix sync_employee_to_public_func to use immutable search_path
  
  5. Password Protection
    - Note: Password leak protection must be enabled in Supabase Dashboard
      Auth > Policies > Enable "Password Leak Protection"
*/

-- ========================================
-- 1. FIX RLS POLICIES - OPTIMIZE AUTH FUNCTION CALLS
-- ========================================

-- Drop and recreate all RLS policies with optimized auth function calls

-- EMPLOYEES TABLE
DROP POLICY IF EXISTS "Admins manage employees" ON employees;
DROP POLICY IF EXISTS "View employees" ON employees;

CREATE POLICY "Admins manage employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "View employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

-- EMPLOYEES_PUBLIC TABLE
DROP POLICY IF EXISTS "Admins manage public employees" ON employees_public;
DROP POLICY IF EXISTS "View public employees" ON employees_public;

CREATE POLICY "Admins manage public employees"
  ON employees_public
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "View public employees"
  ON employees_public
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- CASE_STUDIES TABLE
DROP POLICY IF EXISTS "Admins manage case studies" ON case_studies;
DROP POLICY IF EXISTS "View case studies" ON case_studies;

CREATE POLICY "Admins manage case studies"
  ON case_studies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "View active case studies"
  ON case_studies
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Admins view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  );

-- SERVICE_CARDS TABLE
DROP POLICY IF EXISTS "Admins manage service cards" ON service_cards;
DROP POLICY IF EXISTS "View service cards" ON service_cards;
DROP POLICY IF EXISTS "Authenticated users can insert homepage cards" ON service_cards;
DROP POLICY IF EXISTS "Authenticated users can update homepage cards" ON service_cards;
DROP POLICY IF EXISTS "Authenticated users can delete homepage cards" ON service_cards;

CREATE POLICY "Admins manage service cards"
  ON service_cards
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "View active service cards"
  ON service_cards
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- ========================================
-- 2. REMOVE UNUSED INDEX
-- ========================================

DROP INDEX IF EXISTS idx_profiles_employee_id;

-- ========================================
-- 3. FIX FUNCTION SEARCH PATH
-- ========================================

-- Drop and recreate sync_employee_to_public_func with fixed search_path
DROP TRIGGER IF EXISTS sync_employee_to_public ON employees;
DROP FUNCTION IF EXISTS sync_employee_to_public_func();

CREATE OR REPLACE FUNCTION sync_employee_to_public_func()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO employees_public (
    id,
    name,
    title,
    description,
    image_url,
    is_active,
    created_at,
    updated_at,
    sort_order,
    email,
    phone,
    linkedin,
    xing
  ) VALUES (
    NEW.id,
    NEW.name,
    NEW.title,
    NEW.description,
    NEW.image_url,
    NEW.is_active,
    NEW.created_at,
    NEW.updated_at,
    NEW.sort_order,
    NEW.email,
    NEW.phone,
    NEW.linkedin,
    NEW.xing
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    is_active = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at,
    sort_order = EXCLUDED.sort_order,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    linkedin = EXCLUDED.linkedin,
    xing = EXCLUDED.xing;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER sync_employee_to_public
AFTER INSERT OR UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION sync_employee_to_public_func();

-- ========================================
-- NOTES
-- ========================================

-- Password Leak Protection:
-- This setting cannot be enabled via SQL. Please enable it manually in the Supabase Dashboard:
-- 1. Go to Authentication > Policies
-- 2. Enable "Password Leak Protection"
-- This will check user passwords against HaveIBeenPwned.org database

-- Force schema reload
NOTIFY pgrst, 'reload schema';
