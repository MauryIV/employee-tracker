INSERT INTO department (dept_name) VALUES
('Regional Managment'),
('Graphic Design'),
('Programming'),
('Marketing'),
('Art'),
('Quality Assurance');

INSERT INTO role (title, salary, dept_id) VALUES
('Regional Manager', 120000, 1),
('Supervior', 90000, 1),
('Graphic Designer', 50000, 2),
('Web Developer', 60000, 3),
('Marketing Specialist', 55000, 4),
('Concept Artist', 55000, 5),
('QA Tester', 50000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Smith', 1, NULL),
('Elena', 'Garcia', 2, 1),
('Bob', 'Johnson', 4, 2),
('Charlie', 'Brown', 3, 2),
('Alex', 'Chen', 4, 2),
('Liam', 'Johnson', 5, 2),
('Sophia', 'Lee', 6, 2);