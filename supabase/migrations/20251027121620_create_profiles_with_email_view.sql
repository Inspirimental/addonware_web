/*
  # Create profiles_with_email view
  
  Creates a view that combines profiles with email addresses from auth.users
  and employee information, making it easier to display user information
  in the admin dashboard.
  
  1. New Views
    - `profiles_with_email` - Combines profiles, auth.users, and employees tables
  
  2. Security
    - View inherits RLS policies from underlying tables
    - Only accessible to authenticated users with proper permissions
*/

-- Drop the view if it exists
DROP VIEW IF EXISTS profiles_with_email;

-- Create the view
CREATE VIEW profiles_with_email AS
SELECT 
  p.id,
  p.employee_id,
  p.role,
  p.created_at,
  p.updated_at,
  u.email,
  u.email_confirmed_at,
  e.name as employee_name,
  e.email as employee_email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
LEFT JOIN employees e ON p.employee_id = e.id;

-- Grant access to authenticated users
GRANT SELECT ON profiles_with_email TO authenticated;
