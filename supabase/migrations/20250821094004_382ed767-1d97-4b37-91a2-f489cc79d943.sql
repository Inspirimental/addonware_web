-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'employee');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  role user_role DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update existing policies by dropping them first
DROP POLICY IF EXISTS "Anyone can view active employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can view active case studies" ON public.case_studies;

-- Create policies for employees table
CREATE POLICY "Anyone can view active employees" ON public.employees
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all employees" ON public.employees
  FOR ALL USING (public.is_admin());

CREATE POLICY "Employees can view their own profile" ON public.employees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.employee_id = employees.id
    )
  );

-- Create policies for case_studies table
CREATE POLICY "Anyone can view active case studies" ON public.case_studies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all case studies" ON public.case_studies
  FOR ALL USING (public.is_admin());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'employee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();