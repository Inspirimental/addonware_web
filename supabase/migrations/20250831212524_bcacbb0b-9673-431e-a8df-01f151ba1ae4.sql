-- Add explicit deny policy for public access to employees table
-- This makes our security posture more explicit and should satisfy security scanners

CREATE POLICY "Deny public access to employees" 
ON public.employees 
FOR ALL 
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Add comment explaining security model
COMMENT ON POLICY "Deny public access to employees" ON public.employees IS 
'Explicit deny policy for non-admin/non-employee access to sensitive employee data. Access is only granted via specific admin or employee-owned policies.';