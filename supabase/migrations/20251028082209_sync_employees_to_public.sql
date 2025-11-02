/*
  # Synchronize employees to employees_public automatically

  1. Purpose
    - Create a trigger that automatically syncs public fields from employees to employees_public
    - Ensures that changes in the admin panel are immediately visible on the public website
    - No manual sync or deployment needed

  2. What it does
    - Creates a function that copies public-safe fields from employees to employees_public
    - Creates a trigger that runs after INSERT/UPDATE on employees table
    - Updates employees_public whenever an employee is created or modified

  3. Security
    - Only public-safe fields are synced (no sensitive data)
    - Maintains existing RLS policies on both tables
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS sync_employee_to_public ON employees;
DROP FUNCTION IF EXISTS sync_employee_to_public_func();

-- Create function to sync employee data
CREATE OR REPLACE FUNCTION sync_employee_to_public_func()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the public employee record
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically sync on insert or update
CREATE TRIGGER sync_employee_to_public
AFTER INSERT OR UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION sync_employee_to_public_func();

-- Sync all existing employees to employees_public
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
)
SELECT 
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
FROM employees
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