const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

// const PORT = process.env.PORT || 1000;
const PORT = 1000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "employeeTracker_db",
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    begin();
});

const begin = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "option",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "Add Department",
                    "View All Roles",
                    "Add Role",
                    "View All Employees",
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
            type: "input",
            name: "departmentId",
            message: "Which department the role belongs to:",
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
};
