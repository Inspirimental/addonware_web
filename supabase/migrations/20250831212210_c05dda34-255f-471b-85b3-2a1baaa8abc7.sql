-- Remove public read access to sensitive employees data
-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Drop the permissive public SELECT policy exposing contact info
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'employees' 
      AND policyname = 'Anyone can view active employees'
  ) THEN
    DROP POLICY "Anyone can view active employees" ON public.employees;
  END IF;
END $$;

-- Keep existing secure policies intact:
--  - "Admins can manage all employees" (ALL via is_admin())
--  - "Employees can view their own profile" (SELECT on own record)

-- Optional sanity: comment for audit
COMMENT ON TABLE public.employees IS 'Contains sensitive employee PII. Public SELECT is intentionally disabled. Use employees_public for public info.';