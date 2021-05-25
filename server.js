const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const util = require("util");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SProot21!",
  database: "employeetrackerDB",
});

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) {
        console.log(err);
        console.log("Error: you are not connected to the database.");
        connection.end();
    } console.log(`connected as id ${connection.threadId}`);
      start();
})

function start(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "View Employees by Role",
                "View Employees by Department",
                "View Employees by Manager",
                "View Total Budget by Department",
                "Update Employee details",
                "Update Employee Role",
                "Update Employee Department",
                "Update Employee's Manager",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Delete Employee",
                "Delete Role",
                "Delete Department",
                "Exit"
            ]
        }).then()        
    }