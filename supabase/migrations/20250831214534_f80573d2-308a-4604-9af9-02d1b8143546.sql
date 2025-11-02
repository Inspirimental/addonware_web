-- Add email field to employees_public table
ALTER TABLE public.employees_public 
ADD COLUMN email text NOT NULL DEFAULT '';

-- Update the sync function to include email
CREATE OR REPLACE FUNCTION public.sync_public_employee_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.employees_public (id, name, title, description, email, image_url, is_active, created_at, updated_at)
    VALUES (NEW.id, NEW.name, NEW.title, NEW.description, NEW.email, NEW.image_url, NEW.is_active, NEW.created_at, NEW.updated_at)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      email = EXCLUDED.email,
      image_url = EXCLUDED.image_url,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.employees_public SET
      name = NEW.name,
      title = NEW.title,
      description = NEW.description,
      email = NEW.email,
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
$function$;

-- Sync existing data
INSERT INTO public.employees_public (id, name, title, description, email, image_url, is_active, created_at, updated_at)
SELECT id, name, title, description, email, image_url, is_active, created_at, updated_at
FROM public.employees
WHERE is_active = true
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  email = EXCLUDED.email,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  updated_at = EXCLUDED.updated_at;