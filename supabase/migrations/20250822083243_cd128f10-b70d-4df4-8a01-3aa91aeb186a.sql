-- First, drop the existing overly permissive policy
DROP POLICY "Anyone can view active employees" ON public.employees;

-- Create a new policy that only allows public access to basic information
-- We'll use a security definer function to control exactly what data is exposed
CREATE OR REPLACE FUNCTION public.get_public_employee_info()
RETURNS TABLE (
  id uuid,
  name text,
  title text,
  description text,
  image_url text,
  is_active boolean,
  created_at timestamp with time zone
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    e.id,
    e.name,
    e.title,
    e.description,
    e.image_url,
    e.is_active,
    e.created_at
  FROM public.employees e
  WHERE e.is_active = true;
$$;

-- Create a view for public employee data that only exposes safe information
CREATE OR REPLACE VIEW public.employees_public AS
SELECT 
  id,
  name,
  title,
  description,
  image_url,
  is_active,
  created_at
FROM public.employees
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.employees_public OWNER TO postgres;

-- Create a new policy for public read access to basic employee information only
CREATE POLICY "Public can view basic employee info" 
ON public.employees 
FOR SELECT 
USING (
  -- Only allow access to basic fields for public users
  -- This policy will be combined with application-level filtering
  is_active = true AND 
  -- Ensure this policy only applies when accessing specific safe columns
  current_setting('request.columns', true) IS NULL OR
  current_setting('request.columns', true) SIMILAR TO '%(id|name|title|description|image_url|is_active|created_at)%'
);

-- Note: The above approach with request.columns is complex. Let's use a simpler approach.
-- Drop the policy we just created and use a different strategy
DROP POLICY "Public can view basic employee info" ON public.employees;

-- Create a more restrictive policy that only works for authenticated users by default
-- Public access will be handled through a separate endpoint/view

CREATE POLICY "Authenticated users can view active employees" 
ON public.employees 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Create a new table for public employee data that only contains safe information
CREATE TABLE IF NOT EXISTS public.employees_public (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the public employees table
ALTER TABLE public.employees_public ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read from the public employees table
CREATE POLICY "Anyone can view public employee info" 
ON public.employees_public 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage the public employees table
CREATE POLICY "Admins can manage public employee info" 
ON public.employees_public 
FOR ALL 
USING (is_admin());

-- Create a trigger to sync basic employee data to the public table
CREATE OR REPLACE FUNCTION public.sync_public_employee_data()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.employees_public (id, name, title, description, image_url, is_active, created_at, updated_at)
    VALUES (NEW.id, NEW.name, NEW.title, NEW.description, NEW.image_url, NEW.is_active, NEW.created_at, NEW.updated_at)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.employees_public SET
      name = NEW.name,
      title = NEW.title,
      description = NEW.description,
      image_url = NEW.image_url,
      is_active = NEW.is_active,
      updated_at = NEW.updated_at
    WHERE id = NEW.id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.employees_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS sync_public_employee_data_trigger ON public.employees;
CREATE TRIGGER sync_public_employee_data_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_public_employee_data();

-- Populate the public employees table with existing data
INSERT INTO public.employees_public (id, name, title, description, image_url, is_active, created_at, updated_at)
SELECT id, name, title, description, image_url, is_active, created_at, updated_at
FROM public.employees
WHERE is_active = true
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;