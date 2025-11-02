/*
  # Add sort_order to employees_public table
  
  1. Changes
    - Add `sort_order` column to employees_public table
      - Type: integer
      - Default: 0
      - Not null
    - Update existing rows to match employees table sort_order
  
  2. Purpose
    - Allow public-facing pages to display employees in custom order
    - Keep employees_public in sync with employees table
*/

-- Add sort_order column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employees_public' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE employees_public 
    ADD COLUMN sort_order integer DEFAULT 0 NOT NULL;
    
    -- Sync sort_order from employees table
    UPDATE employees_public ep
    SET sort_order = e.sort_order
    FROM employees e
    WHERE ep.id = e.id;
  END IF;
END $$;