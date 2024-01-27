INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Security"),
       ("Finance"),
       ("Development"),
       ("Customer Service"),
       ("HR");

INSERT INTO roles (title, salary, department_id)
VALUES ("Head of Security", 20000, 2),
        ("CEO", 40000, 1),
        ("Accountant", 35000, 3),
        ("IT Specialist", 35000, 4),
        ("Intern", 15000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Maggie", "McCausland", 4, 4),
        ("Aubrey", "Barnett", 3, 3),
        ("Julie", "Porter", 2, 2),
        ("Cierra", "Riggs", 1, 1);
       
