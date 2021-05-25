const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const util = require("util");
const cTable = require("console.table");

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
  }
  console.log(`connected as id ${connection.threadId}`);
  start();
});

function start() {
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
        "Exit",
      ],
    })
    .then((response) => {
      switch (response.action) {
        // View employees then show the options 
        case "View all Employees":
          viewEmployees();  
          start();
          break;
        // View Employees by Role then show the options 
          case "View Employees by Role":
            viewEmployeesByRole();  
            start();
            break;
          // View Employees by Department then show the options 
          case "View Employees by Department":
            viewEmployeesByDepartment();  
            start();
            break;
         // View Employees by Manager then show the options 
          case "View Employees by Manager":
            viewEmployeesByManager();  
            start();
            break;
        // View Total Budget by Department then show the options 
          case "View Total Budget by Department":
            viewBudgetByDepartment();  
            start();
            break;
        // Update Employee details then show the options 
        case "Update Employee details":
            updateEmployeeDetails();  
            start();
            break; 
        // Update Employee Role then show the options 
        case "Update Employee Role":
            updateEmployeeRole();  
            start();
            break;
        // Update Employee Department then show the options 
        case "Update Employee Department":
            updateEmployeeDepartment();  
            start();
            break;
        // Update Employee Manager then show the options 
        case "Update Employee Manager":
            updateEmployeeManager();  
            start();
            break; 
        // Add Employee then show the options 
        case "Add Employee":
            addEmployee();  
            start();
            break;
        // Add Role then show the options 
        case "Add Role":
            addRole();  
            start();
            break;    
        // Add Department then show the options 
        case "Add Department":
            addDepartment();  
            start();
            break;
        // Delete Employee then show the options 
        case "Delete Employee":
            deleteEmployee();  
            start();
            break; 
        // Delete Role then show the options 
        case "Delete Role":
            deleteRole();  
            start();
            break;    
        // Delete Department then show the options 
        case "Delete Department":
            deleteDepartment();  
            start();
            break;                                                                                                                            
          // Exit if no changes required
        case "Exit":
          break;
      }
    });
}

//-------------------------------------------------------------------------------------------->


