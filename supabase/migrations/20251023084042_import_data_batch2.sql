/*
  # Import Data Batch 2: More Employees

  Import remaining employee records
*/

INSERT INTO employees (id, name, title, description, email, phone, linkedin, xing, image_url, cv_data, is_active, created_at, updated_at)
VALUES 
  ('48149983-e35d-49b3-b5aa-945b6364a866', 'Dr. Reimund Meffert', 'Berater', 'TÜV geprüfter Datenschutzauditor', 'meffert@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:14.850928+00:00'),
  ('6abb842d-474d-400b-8d8e-a2704ff9ea60', 'Tim Beck', 'Senior-Berater', 'Wirtschafts-Informatiker', 'beck@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, false, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:15.639914+00:00'),
  ('a72f8269-313d-41bb-a1e0-dc6a7455e4f1', 'Paul Rosenbusch', 'Berater', 'Dipl.-Informatiker', 'rosenbusch@addonware.de', NULL, NULL, NULL, NULL, '{}'::jsonb, true, '2025-08-31T22:25:20.806795+00:00', '2025-10-23T08:29:16.40656+00:00')
ON CONFLICT (id) DO NOTHING;
