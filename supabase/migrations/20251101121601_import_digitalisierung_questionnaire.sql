/*
  # Import Digitalisierung Questionnaire Data

  Imports the existing questionnaire data from Configurator.tsx into the database:
  - Creates the "Digitalisierung" questionnaire
  - Imports all 5 questions with their answer options
*/

-- Insert the Digitalisierung questionnaire
INSERT INTO questionnaires (slug, title, description, is_active, sort_order)
VALUES (
  'digitalisierung',
  'Reifegrad-Check Digitalisierung',
  'Mit unserem Fragebogen können Sie schnell prüfen, wo Ihre Organisation in der digitalen Transformation steht – und ob addonware der richtige Partner ist.',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Store questionnaire_id for later use
DO $$
DECLARE
  v_questionnaire_id uuid;
  v_question_1_id uuid;
  v_question_2_id uuid;
  v_question_3_id uuid;
  v_question_4_id uuid;
  v_question_5_id uuid;
BEGIN
  -- Get questionnaire ID
  SELECT id INTO v_questionnaire_id FROM questionnaires WHERE slug = 'digitalisierung';

  -- Insert Question 1
  INSERT INTO questionnaire_questions (questionnaire_id, question_text, sort_order)
  VALUES (
    v_questionnaire_id,
    'Welche Art von Transformation planen Sie aktuell?',
    1
  )
  RETURNING id INTO v_question_1_id;

  -- Insert options for Question 1
  INSERT INTO questionnaire_options (question_id, option_text, sort_order)
  VALUES
    (v_question_1_id, 'Digitale Prozesse einführen oder optimieren', 1),
    (v_question_1_id, 'IT-Projekt umsetzen', 2),
    (v_question_1_id, 'Datenschutz-/Sicherheits-Themen angehen', 3),
    (v_question_1_id, 'Strategieentwicklung oder Change-Prozess', 4),
    (v_question_1_id, 'Noch unklar – ich suche Orientierung', 5);

  -- Insert Question 2
  INSERT INTO questionnaire_questions (questionnaire_id, question_text, sort_order)
  VALUES (
    v_questionnaire_id,
    'Wo sehen Sie aktuell die größten Herausforderungen?',
    2
  )
  RETURNING id INTO v_question_2_id;

  -- Insert options for Question 2
  INSERT INTO questionnaire_options (question_id, option_text, sort_order)
  VALUES
    (v_question_2_id, 'Mangelnde Zeit oder Ressourcen', 1),
    (v_question_2_id, 'Komplexe IT-Strukturen', 2),
    (v_question_2_id, 'Fehlende Strategie oder Zielbild', 3),
    (v_question_2_id, 'Widerstand im Team / Change-Kommunikation', 4),
    (v_question_2_id, 'Rechtliche Unsicherheit (z. B. DSGVO)', 5);

  -- Insert Question 3
  INSERT INTO questionnaire_questions (questionnaire_id, question_text, sort_order)
  VALUES (
    v_questionnaire_id,
    'Wie ist Ihre interne IT aufgestellt?',
    3
  )
  RETURNING id INTO v_question_3_id;

  -- Insert options for Question 3
  INSERT INTO questionnaire_options (question_id, option_text, sort_order)
  VALUES
    (v_question_3_id, 'Starke interne IT-Abteilung', 1),
    (v_question_3_id, 'Einzelne IT-Verantwortliche', 2),
    (v_question_3_id, 'Externer Dienstleister', 3),
    (v_question_3_id, 'Noch keine klare Struktur', 4);

  -- Insert Question 4
  INSERT INTO questionnaire_questions (questionnaire_id, question_text, sort_order)
  VALUES (
    v_questionnaire_id,
    'Wann möchten Sie starten?',
    4
  )
  RETURNING id INTO v_question_4_id;

  -- Insert options for Question 4
  INSERT INTO questionnaire_options (question_id, option_text, sort_order)
  VALUES
    (v_question_4_id, 'Sofort', 1),
    (v_question_4_id, 'In den nächsten 3 Monaten', 2),
    (v_question_4_id, 'Langfristig planen', 3),
    (v_question_4_id, 'Unklar – ich möchte mich erst orientieren', 4);

  -- Insert Question 5
  INSERT INTO questionnaire_questions (questionnaire_id, question_text, sort_order)
  VALUES (
    v_questionnaire_id,
    'Was erwarten Sie sich von einer Zusammenarbeit?',
    5
  )
  RETURNING id INTO v_question_5_id;

  -- Insert options for Question 5
  INSERT INTO questionnaire_options (question_id, option_text, sort_order)
  VALUES
    (v_question_5_id, 'Strategische Klarheit und Zieldefinition', 1),
    (v_question_5_id, 'Technische Umsetzung mit Projektsteuerung', 2),
    (v_question_5_id, 'Begleitung bei Förderanträgen oder Ausschreibungen', 3),
    (v_question_5_id, 'Beratung auf Augenhöhe ohne Fachchinesisch', 4),
    (v_question_5_id, 'Noch offen – ich höre mir gern Vorschläge an', 5);
END $$;
