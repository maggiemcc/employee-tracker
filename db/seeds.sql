INSERT INTO departments (name)
VALUES ("Sales"),
       ("Security"),
       ("Finance"),
       ("Development"),
       ("Customer Service"),
       ("HR");

INSERT INTO roles (title, salary, department_id)
VALUES ("Head of Security", 20000, 1),
        ("CEO", 40000, 2),
        ("Accountant", 35000, 3),
        ("IT Specialist", 35000, 4),
        ("Intern", 15000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Maggie", "McCausland", 1, 2),
        ("Aubrey", "Barnett", 2, 2),
        ("Julie", "Porter", 3, 2),
        ("Cierra", "Riggs", 4, 2);
       
