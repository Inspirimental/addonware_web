/*
  # Import Data Batch 1: Employees

  Import employee records from old database
*/

INSERT INTO employees (id, name, title, description, email, phone, linkedin, xing, image_url, cv_data, is_active, created_at, updated_at)
VALUES 
  ('1c134596-6755-4650-a460-1d641e934b4a', 'Pierre Gluth', 'Senior-Berater', 'ISO Zertifizierer & Auditor', 'gluth@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:11.866884+00:00'),
  ('24e7c732-de41-498e-b94b-44216064573b', 'Eirik Otto', 'Senior-Berater', 'Geprüfter IT-Berater BITKOM Lizenz IT-BERATER-044', 'otto@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, false, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:13.017858+00:00'),
  ('2ad14a42-d6fb-4048-8549-b1a24096259a', 'Jörg Flügge', 'Geschäftsführender Gesellschafter', 'Dipl.-Informatiker | 40 Jahre Erfahrung', 'fluegge@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:13.978193+00:00')
ON CONFLICT (id) DO NOTHING;
