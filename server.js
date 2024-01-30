const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

const PORT = process.env.PORT || 1000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    console.log(`Server running on port ${PORT}`);

    begin();
});

// ASK DESIRED TASK
const begin = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "option",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add Department",
                    "Add Role",
                    "Add Employee",
                    "Update Employee Role",
                    "Exit",
                ],
            },
        ])
        .then((data) => {
            switch (data.option) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    db.end();
                    console.log("Now Quitting");
                    break;
            }
        });
};

// VIEW ALL
function viewAllDepartments() {
    const allDepts = `SELECT * FROM departments`;
    db.query(allDepts, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
}

function viewAllRoles() {
    const allRoles = `SELECT roles.title, roles.id, departments.name, roles.salary from roles join departments on roles.department_id = departments.id`;
    db.query(allRoles, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
}

function viewAllEmployees() {
    const allEmployees = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id;
    `;
    db.query(allEmployees, (err, res) => {
        if (err) throw err;
        console.table(res);
        begin();
    });
};

// ADDING
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Name of the new department:",
        })
        .then((data) => {
            const newDepartment = `INSERT INTO departments (name) VALUES ("${data.name}")`;
            db.query(newDepartment, (err, res) => {
                if (err) throw err;
                console.log(`SUCCESS! Added department ${data.name} to the database.`);
                begin();
            });
        });
};

function addRole() {
    const departments = `SELECT * FROM departments`;
    db.query(departments, (err, departments) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Name of the new role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "The role salary amount:",
                },
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department the role belongs to:",
                    choices: departments.map((dept) => ({
                        name: dept.name,
                        value: dept.id,
                    })),
                },
            ])
            .then((data) => {
                const newRole = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                db.query(newRole,
                    [data.title, data.salary, data.departmentId],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`SUCCESS! Added role ${data.title} to the database.`);
                        begin();
                    });
            });
    });
};


function addEmployee() {
    const managers = `SELECT * FROM employees`;
    const roles = `SELECT * FROM roles`;
    db.query(roles, (err, role) => {
        if (err) throw err;

        db.query(managers, (err, manager) => {
            if (err) throw err;

            const managerChoices = [
                { name: 'None', value: null },
                ...manager.map(manager => ({
                    name: manager.first_name,
                    value: manager.id
                }))
            ];

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "Enter employee's FIRST name:",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "Enter employee's LAST name:",
                    },
                    {
                        type: "list",
                        name: "role_id",
                        message: "The employee's position:",
                        choices: role.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                    {
                        type: "list",
                        name: "manager_id",
                        message: "Enter the employee's manager ID:",
                        choices: managerChoices,
                    },
                ])
                .then((data) => {
                    const newEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(newEmployee,
                        [data.first_name, data.last_name, data.role_id, data.manager_id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`SUCCESS! Added employee ${data.first_name} ${data.last_name} to the database.`);
                            begin();
                        });
                });
        });
    });
};

// UPDATING
function updateEmployeeRole() {
    const employees = `SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id`;
    const roles = `SELECT * FROM roles`;
    db.query(roles, (err, listRoles) => {
        if (err) throw err;

        db.query(employees, (err, listEmployees) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: 'The employee you want to update:',
                        choices: listEmployees.map((employee) => `${employee.first_name} ${employee.last_name}`),
                    },
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'New role for employee:',
                        choices: listRoles.map((role) => role.title),

                    },
                ])
                .then((data) => {
                    const findEmployee = listEmployees.find((employee)=> `${employee.first_name} ${employee.last_name}` === data.employeeName);
                    const findRole = listRoles.find((role)=> role.title === data.newRoleId);

                    const updateEmployee = 'UPDATE employees SET role_id = ? WHERE id = ?';

                    db.query(updateEmployee, [findRole.id, findEmployee.id], (err, res) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        begin();
                    });
                });
        });
    });
}