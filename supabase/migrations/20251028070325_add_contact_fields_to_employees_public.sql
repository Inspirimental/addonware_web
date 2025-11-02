/*
  # Add Contact Fields to Public Employees Table

  1. Changes
    - Add `email` column to `employees_public` table
    - Add `phone` column to `employees_public` table
    - Add `linkedin` column to `employees_public` table
    - Add `xing` column to `employees_public` table
    - Copy existing data from `employees` table to `employees_public` table

  2. Security
    - No RLS changes needed (existing policies remain in place)
*/

-- Add contact fields to employees_public table
ALTER TABLE employees_public
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS linkedin text,
ADD COLUMN IF NOT EXISTS xing text;

-- Copy existing contact data from employees to employees_public
UPDATE employees_public ep
SET 
  email = e.email,
  phone = e.phone,
  linkedin = e.linkedin,
  xing = e.xing
FROM employees e
WHERE ep.id = e.id;
