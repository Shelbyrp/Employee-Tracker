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
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add Department",
                "Add Role",
                "Remove employee",
                "Update employee role",
                "Update employee manager"
            ]
        }).then()        
    }