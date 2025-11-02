/*
  # Erstelle Umfrage für Digitale Souveränität & Compliance
  
  1. Neue Umfrage
    - Fügt eine neue Umfrage für "Digitale Souveränität & Compliance" hinzu
    - Slug: `digitale-souveraenitaet`
    - Notification Email wird gesetzt
  
  2. Fragen
    - Frage 1: Datenverfügbarkeit (Multiple Choice)
    - Frage 2: IT-Architektur & Abhängigkeit (Rating, Skala 1-5)
    - Frage 3: Datenschutz in der Praxis (Multiple Choice)
    - Frage 4: Potenzialnutzung von Daten (Rating, Skala 1-5)
    - Frage 5: Freitext zum Abschluss
  
  3. Antwortoptionen
    - Optionen werden in questionnaire_options Tabelle gespeichert
*/

-- Insert questionnaire
INSERT INTO questionnaires (
  title,
  slug,
  description,
  is_active,
  notification_email
) VALUES (
  'Reifegrad-Check: Digitale Souveränität',
  'digitale-souveraenitaet',
  'Prüfen Sie Ihren Status in Sachen digitale Souveränität, Datenverfügbarkeit und Compliance.',
  true,
  'kontakt@addonware.de'
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  notification_email = EXCLUDED.notification_email;

-- Get the questionnaire ID and insert questions with options
DO $$
DECLARE
  v_questionnaire_id uuid;
  v_question_id uuid;
BEGIN
  SELECT id INTO v_questionnaire_id 
  FROM questionnaires 
  WHERE slug = 'digitale-souveraenitaet';

  -- Frage 1: Datenverfügbarkeit (Multiple Choice)
  INSERT INTO questionnaire_questions (
    questionnaire_id,
    question_text,
    question_type,
    sort_order
  ) VALUES (
    v_questionnaire_id,
    'Wissen Sie, wo Ihre wichtigsten Daten liegen – und wer darauf Zugriff hat?',
    'multiple_choice',
    1
  ) RETURNING id INTO v_question_id;

  -- Options for Question 1
  INSERT INTO questionnaire_options (question_id, option_text, sort_order) VALUES
    (v_question_id, 'Ja, das ist transparent geregelt', 1),
    (v_question_id, 'Teils – wir haben unterschiedliche Regelungen', 2),
    (v_question_id, 'Nein – das ist nicht klar definiert', 3),
    (v_question_id, 'Ich weiß es nicht', 4);

  -- Frage 2: IT-Architektur & Abhängigkeit (Rating 1-5)
  INSERT INTO questionnaire_questions (
    questionnaire_id,
    question_text,
    question_type,
    sort_order,
    rating_min,
    rating_max
  ) VALUES (
    v_questionnaire_id,
    'Unsere Systeme sind so aufgebaut, dass wir jederzeit unabhängig von einem Anbieter handeln könnten.',
    'rating',
    2,
    1,
    5
  );

  -- Frage 3: Datenschutz in der Praxis (Multiple Choice)
  INSERT INTO questionnaire_questions (
    questionnaire_id,
    question_text,
    question_type,
    sort_order
  ) VALUES (
    v_questionnaire_id,
    'Wie würden Sie den aktuellen Stand Ihres Datenschutzmanagements einschätzen?',
    'multiple_choice',
    3
  ) RETURNING id INTO v_question_id;

  -- Options for Question 3
  INSERT INTO questionnaire_options (question_id, option_text, sort_order) VALUES
    (v_question_id, 'Wir haben ein gut gelebtes Datenschutzkonzept', 1),
    (v_question_id, 'Wir erfüllen gesetzliche Anforderungen, aber es lebt nicht im Alltag', 2),
    (v_question_id, 'Es gibt große Lücken oder Unsicherheiten', 3),
    (v_question_id, 'Ich bin mir nicht sicher', 4);

  -- Frage 4: Potenzialnutzung von Daten (Rating 1-5)
  INSERT INTO questionnaire_questions (
    questionnaire_id,
    question_text,
    question_type,
    sort_order,
    rating_min,
    rating_max
  ) VALUES (
    v_questionnaire_id,
    'Wir nutzen unsere Daten aktiv, um Prozesse zu verbessern oder neue Geschäftsfelder zu erschließen.',
    'rating',
    4,
    1,
    5
  );

  -- Frage 5: Freitext zum Abschluss
  INSERT INTO questionnaire_questions (
    questionnaire_id,
    question_text,
    question_type,
    sort_order
  ) VALUES (
    v_questionnaire_id,
    'Wo fühlen Sie sich aktuell am stärksten eingeschränkt – oder am meisten abhängig?',
    'text',
    5
  );

END $$;