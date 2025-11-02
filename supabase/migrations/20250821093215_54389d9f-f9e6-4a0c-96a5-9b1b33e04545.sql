-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  email TEXT NOT NULL,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_case_studies_active ON case_studies(is_active);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_date ON case_studies(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample employees (migrated from static data)
INSERT INTO employees (name, title, description, email, phone, linkedin, xing, image_url, is_active) VALUES
('Jörg Flügge', 'CEO, Co-Founder', 'Digitale Geschäftsmodelle und Keynotespeaker', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/joerg-fluegge.jpg', true),
('Prof. Dr. Uwe Straubel', 'Co-Founder', 'Digitale Strategie und Projektmanagement', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/uwe-straubel.jpg', true),
('Dr. Reimund Meffert', 'Senior-Berater', 'Digitalisierung und Marketing', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/reimund-meffert.jpg', true),
('Oliver Möller', 'Senior-Berater', 'Digitale Prozesse und Produkte', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/oliver-moeller.jpg', true),
('Paul Rosenbusch', 'Senior-Berater', 'Digitale Prozesse und Produkte', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/paul-rosenbusch.jpg', true),
('Tim Beck', 'Senior-Berater', 'Business Cases & Organisationsentwicklung', 'beck@addonware.de', '+49 171 2313510', 'https://www.linkedin.com/in/tim-h-beck', 'https://www.xing.com/profile/Tim_Beck', '/lovable-uploads/a85b8324-beb0-458b-8b9b-b562dd0530ad.png', true),
('Falko Smirat', 'Senior-Berater', 'Social Media und Social Advertising', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/falko-smirat.jpg', true),
('Eirik Otto', 'Senior-Berater', 'Vertrieb und Kommunikation', 'info@addonware.de', '+49 (0) 3671 / 524279-0', 'https://www.linkedin.com/company/addonware-gmbh', NULL, '/src/assets/team/eirik-otto.jpg', true)
ON CONFLICT (email) DO NOTHING;