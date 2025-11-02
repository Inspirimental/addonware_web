-- Fix database security warnings and implement audit logging (fixed version)

-- Update is_admin function with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'employee');
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create audit log table for security monitoring (only if not exists)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action text NOT NULL,
    table_name text,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'audit_logs' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Create policy for audit logs (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'audit_logs' 
        AND policyname = 'Admins can view audit logs'
    ) THEN
        CREATE POLICY "Admins can view audit logs"
        ON public.audit_logs
        FOR SELECT
        USING (is_admin());
    END IF;
END
$$;

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    old_data jsonb;
    new_data jsonb;
BEGIN
    IF TG_OP = 'DELETE' THEN
        old_data = to_jsonb(OLD);
        INSERT INTO public.audit_logs (
            user_id, action, table_name, record_id, old_values
        ) VALUES (
            auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, old_data
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data = to_jsonb(OLD);
        new_data = to_jsonb(NEW);
        INSERT INTO public.audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, old_data, new_data
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        new_data = to_jsonb(NEW);
        INSERT INTO public.audit_logs (
            user_id, action, table_name, record_id, new_values
        ) VALUES (
            auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, new_data
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- Add audit triggers to sensitive tables (drop first if they exist)
DROP TRIGGER IF EXISTS audit_employees ON public.employees;
CREATE TRIGGER audit_employees
    AFTER INSERT OR UPDATE OR DELETE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- Add comments about security improvements
COMMENT ON TABLE public.audit_logs IS 'Security audit trail for tracking all changes to sensitive data';
COMMENT ON FUNCTION public.is_admin() IS 'Security-hardened admin check function with proper search_path';