use employeetrackerDB;
INSERT INTO
  department (department_name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');
INSERT INTO
  roles (title, salary, department_id)
VALUES
  ('Sales Manager', 90000, 1),
  ('Sales Rep', 75000, 1),
  ('Engineering Manager', 170000, 2),
  ('Software Engineer', 130000, 2),
  ('Finance Manager', 150000, 3),
  ('Accountant', 110000, 3),
  ('Legal Manager', 240000, 4),
  ('Lawyer', 180000, 4);
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Brad', 'Pitt', 1, NULL),
  ('Will', 'Smith', 2, 1),
  ('Tom', 'Hanks', 3, NULL),
  ('Julia', 'Roberts', 4, 3),
  ('Matt', 'Damon', 5, NULL),
  ('Angelina', 'Jolie', 6, 5),
  ('Jennifer', 'Aniston', 7, NULL),
  ('Ryan', 'Reynolds', 8, 7);
INSERT INTO
  manager (id, manager_name)
VALUES
  (1, 'Brad Pitt'),
  (2, 'Tom Hanks'),
  (3, 'Matt Damon'),
  (4, 'Jennifer Aniston')
  