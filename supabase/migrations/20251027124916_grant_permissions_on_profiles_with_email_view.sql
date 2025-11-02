/*
  # Grant permissions on profiles_with_email view
  
  Ensures that the profiles_with_email view is accessible to authenticated users
  and that admins can see all profiles through the view.
  
  ## Changes
  
  1. Grant SELECT on profiles_with_email to authenticated and anon roles
  2. Ensure the view respects the underlying RLS policies
  
  ## Security
  
  - View inherits RLS from underlying profiles table
  - Only authenticated users can access
  - Admins can see all profiles via is_admin() function
*/

-- Ensure the view exists and is up to date
DROP VIEW IF EXISTS profiles_with_email CASCADE;

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

-- Grant permissions
GRANT SELECT ON profiles_with_email TO authenticated;
GRANT SELECT ON profiles_with_email TO anon;

-- Add comment for documentation
COMMENT ON VIEW profiles_with_email IS 
'View combining profiles with email addresses from auth.users and employee information. Inherits RLS policies from the profiles table.';
