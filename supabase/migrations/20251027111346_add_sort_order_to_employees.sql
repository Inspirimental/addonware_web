/*
  # Add sort_order column to employees table
  
  1. Changes
    - Add `sort_order` column to employees table
      - Type: integer
      - Default: 0
      - Not null
    - Update existing rows to have default sort_order based on created_at
  
  2. Purpose
    - Allow manual ordering of employees in the admin interface
    - Maintain backward compatibility with existing data
*/

-- Add sort_order column with default value
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'employees' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE employees 
    ADD COLUMN sort_order integer DEFAULT 0 NOT NULL;
    
    -- Set sort_order for existing employees based on created_at
    WITH ranked_employees AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 AS row_num
      FROM employees
    )
    UPDATE employees e
    SET sort_order = r.row_num
    FROM ranked_employees r
    WHERE e.id = r.id;
  END IF;
END $$;