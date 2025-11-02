/*
  # Import Data Batch 3: Final Employees

  Import final employee records
*/

INSERT INTO employees (id, name, title, description, email, phone, linkedin, xing, image_url, cv_data, is_active, created_at, updated_at)
VALUES 
  ('be91b178-93a8-4118-aeae-93beda7b673d', 'Oliver Möller', 'Berater', 'Dipl.-Wirtschafts-Ingenieur | Kommunikationsdesigner', 'moeller@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:17.152756+00:00'),
  ('d1d69465-a73d-42e3-87f1-40c5cd2c000c', 'Prof. Dr. Uwe Straubel', 'Berater', 'IT-Recht & IT-Sicherheit', 'straubel@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:17.885983+00:00'),
  ('e15959b8-8161-4489-89a3-0bbcc6857d89', 'Falko Smirat', 'Berater', 'Dipl.-Ing. Maschinenbau | Lean Six Sigma Black Belt', 'smirat@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:18.604637+00:00')
ON CONFLICT (id) DO NOTHING;
