/*
  # Insert Initial Homepage Cards

  This migration inserts the 8 initial homepage cards:
  - 4 service cards (Focus Work)
  - 4 case study cards (Case Study)

  All cards are set as active and ordered sequentially.
*/

-- Insert the 4 service cards
INSERT INTO homepage_cards (title, subtitle, teaser, category, icon, background_image, link_type, link_value, order_index, is_active)
VALUES 
  (
    'Strategie & Zielbildentwicklung',
    'Wirkung braucht Richtung',
    'Klare Ziele statt Formulierungsträume: Wir helfen, den Weg realistisch zu planen. Mit strukturierten Workshops entwickeln wir gemeinsam Ihr Zielbild und definieren konkrete nächste Schritte.',
    'Focus Work',
    'Target',
    '/src/assets/headers/strategy-header.jpg',
    'service',
    'strategie',
    0,
    true
  ),
  (
    'Projektbegleitung & Digitalisierung',
    'Von der Idee zur Umsetzung',
    'Vom Plan zur Umsetzung: Wir moderieren zwischen Fachbereich und Technik. Als operative Projektleitung sorgen wir für Struktur, Kommunikation und den Blick aufs Wesentliche.',
    'Focus Work',
    'Settings',
    '/src/assets/headers/digitalization-header.jpg',
    'service',
    'projektbegleitung',
    1,
    true
  ),
  (
    'Datenschutz & Informationssicherheit',
    'Datenschutz ist kein Showstopper – sondern Organisations­aufgabe.',
    'Sicherheit, die zu Ihnen passt: Recht, Technik und Pragmatismus vereint. Wir entwickeln DSGVO-konforme Lösungen, die Ihre Teams verstehen und gerne umsetzen.',
    'Focus Work',
    'Shield',
    '/src/assets/headers/security-header.jpg',
    'service',
    'datenschutz',
    2,
    true
  ),
  (
    'Prozessberatung öffentlicher Bereich',
    'Verwaltung soll gestalten, nicht verwalten.',
    'Viele Prozesse im öffentlichen Bereich sind historisch gewachsen, papierbasiert, personenabhängig – und oft ein Hindernis für digitale Vorhaben. Wir helfen öffentlichen Einrichtungen dabei, ihre Abläufe so zu gestalten, dass sie effizient, anschlussfähig und zukunftsorientiert funktionieren.',
    'Focus Work',
    'Users',
    '/src/assets/headers/public-processes-header.jpg',
    'service',
    'prozessberatung',
    3,
    true
  );

-- Insert the 4 case study cards (using the first 4 case studies)
INSERT INTO homepage_cards (title, subtitle, teaser, category, icon, background_image, link_type, link_value, order_index, is_active)
SELECT 
  title,
  COALESCE(category, 'Erfolgsgeschichte'),
  COALESCE(challenge, ''),
  'Case Study',
  'FileText',
  '/src/assets/headers/digitalization-header.jpg',
  'case-study',
  id::text,
  ROW_NUMBER() OVER (ORDER BY created_at) + 3,
  true
FROM case_studies
ORDER BY created_at
LIMIT 4;