/*
  # Restore Führung & Strategie Questionnaire
  
  Restores the accidentally deleted "Führung & Strategie" questionnaire
  This is a simple placeholder restoration - the actual questions will need to be added later through the admin interface
  
  1. Questionnaire
    - Restores the main questionnaire entry with correct settings
*/

-- Restore the Führung & Strategie questionnaire
INSERT INTO questionnaires (slug, title, description, is_active, sort_order, notification_email)
VALUES (
  'fuehrung',
  'Reifegrad-Check Führung & Strategie',
  'Überprüfen Sie den Reifegrad Ihrer Führungskultur und Strategie und erhalten Sie konkrete Handlungsempfehlungen.',
  true,
  2,
  'info@addonware.de'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  notification_email = EXCLUDED.notification_email;
