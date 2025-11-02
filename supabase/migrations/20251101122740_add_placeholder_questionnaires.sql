/*
  # Add Placeholder Questionnaires

  Creates placeholder questionnaires for "Führung" and "Struktur" to be displayed in the admin interface
*/

-- Insert Führung questionnaire
INSERT INTO questionnaires (slug, title, description, is_active, sort_order)
VALUES (
  'fuehrung',
  'Reifegrad-Check Führung',
  'Überprüfen Sie den Reifegrad Ihrer Führungskultur und erhalten Sie Handlungsempfehlungen.',
  false,
  2
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Struktur questionnaire
INSERT INTO questionnaires (slug, title, description, is_active, sort_order)
VALUES (
  'struktur',
  'Reifegrad-Check Struktur',
  'Analysieren Sie die organisatorischen Strukturen in Ihrem Unternehmen.',
  false,
  3
)
ON CONFLICT (slug) DO NOTHING;
