/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing index for foreign key on profiles.employee_id
    - Optimize RLS policies to use (select auth.uid()) pattern
    - Remove unused indexes

  2. Security Improvements
    - Consolidate multiple permissive policies into single policies
    - Remove SECURITY DEFINER from views where not needed
    
  3. Changes
    - Add index: idx_profiles_employee_id
    - Update RLS policies to use subquery pattern for better performance
    - Drop unused indexes
    - Consolidate duplicate policies
*/

-- Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON profiles(employee_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_case_studies_date;
DROP INDEX IF EXISTS idx_homepage_cards_active;
DROP INDEX IF EXISTS idx_employees_email;
DROP INDEX IF EXISTS idx_case_studies_active;
DROP INDEX IF EXISTS idx_case_studies_category;

-- Optimize profiles RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Optimize media_files RLS policies
DROP POLICY IF EXISTS "Users can update own images or admins can update any" ON media_files;
DROP POLICY IF EXISTS "Users can delete own images or admins can delete any" ON media_files;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON media_files;

CREATE POLICY "Users can update own images or admins can update any"
  ON media_files FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = (select auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (select auth.uid()) 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can delete own images or admins can delete any"
  ON media_files FOR DELETE
  TO authenticated
  USING (
    uploaded_by = (select auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = (select auth.uid()) 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can upload images"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = (select auth.uid()));

-- Consolidate case_studies policies
DROP POLICY IF EXISTS "Admins can manage all case studies" ON case_studies;
DROP POLICY IF EXISTS "Anyone can view active case studies" ON case_studies;

-- Single policy for viewing case studies
CREATE POLICY "View case studies"
  ON case_studies FOR SELECT
  USING (
    is_active = true OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin management policy
CREATE POLICY "Admins manage case studies"
  ON case_studies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Consolidate employees policies
DROP POLICY IF EXISTS "Admins can manage all employees" ON employees;
DROP POLICY IF EXISTS "Authenticated users can view active employees" ON employees;

CREATE POLICY "View employees"
  ON employees FOR SELECT
  TO authenticated
  USING (
    is_active = true OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins manage employees"
  ON employees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Consolidate employees_public policies
DROP POLICY IF EXISTS "Admins can manage public employee info" ON employees_public;
DROP POLICY IF EXISTS "Anyone can view public employee info" ON employees_public;

CREATE POLICY "View public employees"
  ON employees_public FOR SELECT
  USING (
    is_active = true OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins manage public employees"
  ON employees_public FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Consolidate service_cards policies
DROP POLICY IF EXISTS "Anonymous users can view active cards" ON service_cards;
DROP POLICY IF EXISTS "Anyone can view active homepage cards" ON service_cards;
DROP POLICY IF EXISTS "Authenticated users can view all homepage cards" ON service_cards;

CREATE POLICY "View service cards"
  ON service_cards FOR SELECT
  USING (
    is_active = true OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins manage service cards"
  ON service_cards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS homepage_cards;
CREATE VIEW homepage_cards AS
SELECT 
  id,
  title,
  subtitle,
  teaser,
  category,
  icon,
  background_image,
  link_type,
  link_value,
  order_index,
  is_active,
  created_at,
  updated_at
FROM service_cards;

DROP VIEW IF EXISTS images;
CREATE VIEW images AS
SELECT 
  id,
  filename,
  storage_path,
  url,
  alt_text,
  size,
  mime_type,
  uploaded_by,
  created_at,
  updated_at
FROM media_files;
