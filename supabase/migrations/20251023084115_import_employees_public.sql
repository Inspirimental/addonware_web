/*
  # Import Employees Public

  Import public employee information
*/

INSERT INTO employees_public (id, name, title, description, image_url, is_active, created_at, updated_at)
VALUES 
  ('1c134596-6755-4650-a460-1d641e934b4a', 'Pierre Gluth', 'Senior-Berater', 'ISO Zertifizierer & Auditor', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:11.866884+00:00'),
  ('24e7c732-de41-498e-b94b-44216064573b', 'Eirik Otto', 'Senior-Berater', 'Geprüfter IT-Berater BITKOM Lizenz IT-BERATER-044', NULL, false, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:13.017858+00:00'),
  ('2ad14a42-d6fb-4048-8549-b1a24096259a', 'Jörg Flügge', 'Geschäftsführender Gesellschafter', 'Dipl.-Informatiker | 40 Jahre Erfahrung', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:13.978193+00:00'),
  ('48149983-e35d-49b3-b5aa-945b6364a866', 'Dr. Reimund Meffert', 'Berater', 'TÜV geprüfter Datenschutzauditor', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:14.850928+00:00'),
  ('6abb842d-474d-400b-8d8e-a2704ff9ea60', 'Tim Beck', 'Senior-Berater', 'Wirtschafts-Informatiker', NULL, false, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:15.639914+00:00'),
  ('a72f8269-313d-41bb-a1e0-dc6a7455e4f1', 'Paul Rosenbusch', 'Berater', 'Dipl.-Informatiker', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:16.40656+00:00'),
  ('be91b178-93a8-4118-aeae-93beda7b673d', 'Oliver Möller', 'Berater', 'Dipl.-Wirtschafts-Ingenieur | Kommunikationsdesigner', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:17.152756+00:00'),
  ('d1d69465-a73d-42e3-87f1-40c5cd2c000c', 'Prof. Dr. Uwe Straubel', 'Berater', 'IT-Recht & IT-Sicherheit', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:17.885983+00:00'),
  ('e15959b8-8161-4489-89a3-0bbcc6857d89', 'Falko Smirat', 'Berater', 'Dipl.-Ing. Maschinenbau | Lean Six Sigma Black Belt', NULL, true, '2025-08-31T22:25:24.226986+00:00', '2025-10-23T08:29:18.604637+00:00')
ON CONFLICT (id) DO NOTHING;
