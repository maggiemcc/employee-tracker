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
        switch(data.option){
            case "View All Departments": viewAllDepartments();
            break;
            case "Add Department": addDepartment();
            break;
            case "View All Roles": viewAllRoles();
            break;
            case "Add Role": addRole();
            break;
            case "View All Employees": viewAllEmployees();
            break;
            case "Add Employee": addEmployee();
            break;
            case "Update Employee Role": updateEmployeeRole();
            break;
            case "Exit": db.end();
            console.log("Now Quitting");
            break;
        }
    });
};