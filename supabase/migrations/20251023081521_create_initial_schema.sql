/*
  # Initial Schema Setup for Addonware

  1. New Tables
    - `employees` - Store employee information
    - `case_studies` - Store case study information
    - `profiles` - Extended user profile information
    - `employees_public` - Public-facing employee data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access
    - Create admin role checking function

  3. Functions & Triggers
    - Auto-update timestamps
    - Admin role checking
    - User profile creation
    - Public data synchronization
*/

-- Create user role enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'employee');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  linkedin TEXT,
  xing TEXT,
  image_url TEXT,
  cv_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  result TEXT NOT NULL,
  duration TEXT,
  company TEXT NOT NULL,
  detailed_description TEXT,
  technologies JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  image_url TEXT,
  date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  role user_role DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create public employees table
CREATE TABLE IF NOT EXISTS employees_public (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_case_studies_active ON case_studies(is_active);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_date ON case_studies(date);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees_public ENABLE ROW LEVEL SECURITY;

-- Create helper functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'employee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION sync_public_employee_data()
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

-- Create triggers
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS sync_public_employee_data_trigger ON employees;
CREATE TRIGGER sync_public_employee_data_trigger
  AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION sync_public_employee_data();

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles  
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for employees
DROP POLICY IF EXISTS "Authenticated users can view active employees" ON employees;
CREATE POLICY "Authenticated users can view active employees" 
ON employees 
FOR SELECT 
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all employees" ON employees;
CREATE POLICY "Admins can manage all employees" ON employees
  FOR ALL USING (is_admin());

-- Create RLS policies for case_studies
DROP POLICY IF EXISTS "Anyone can view active case studies" ON case_studies;
CREATE POLICY "Anyone can view active case studies" ON case_studies
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all case studies" ON case_studies;
CREATE POLICY "Admins can manage all case studies" ON case_studies
  FOR ALL USING (is_admin());

-- Create RLS policies for employees_public
DROP POLICY IF EXISTS "Anyone can view public employee info" ON employees_public;
CREATE POLICY "Anyone can view public employee info" 
ON employees_public 
FOR SELECT 
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage public employee info" ON employees_public;
CREATE POLICY "Admins can manage public employee info" 
ON employees_public 
FOR ALL 
USING (is_admin());