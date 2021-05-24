const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const util = require("util");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Be sure to update with your own MySQL password!
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

function start()