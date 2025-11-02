-- Create a default admin user
-- Email: admin@addonware.ch
-- Password: Addonware2024!

-- Note: This will create a user in auth.users and a corresponding profile
-- The user should change the password after first login
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@addonware.ch',
  crypt('Addonware2024!', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);