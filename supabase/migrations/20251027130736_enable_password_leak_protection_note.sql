/*
  # Enable Password Leak Protection
  
  Password leak protection must be enabled in the Supabase Dashboard.
  This feature checks passwords against the HaveIBeenPwned database.
  
  ## Manual Steps Required
  
  To enable this feature:
  1. Go to Supabase Dashboard
  2. Navigate to Authentication > Policies
  3. Enable "Password Leak Protection"
  
  This will prevent users from setting passwords that have been compromised
  in known data breaches, significantly improving security.
  
  ## Note
  
  This setting cannot be configured via SQL migrations - it must be set
  through the Supabase Dashboard or CLI configuration.
*/

-- This migration serves as documentation only
-- The actual setting must be configured in the Supabase Dashboard

SELECT 'Password leak protection must be enabled in Supabase Dashboard' as notice;
