-- Update admin user profile to have admin role and remove employee link
UPDATE profiles 
SET 
  role = 'admin',
  employee_id = NULL,
  updated_at = NOW()
WHERE id = '03e5b8c5-9729-46cf-b15b-67a7bb1d11cb';