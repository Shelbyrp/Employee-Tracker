const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const { exit } = require("process");
const cTable = require("console.table");
const util = require("util");

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
                "1. View all Employees",
                "2. View Employees by Role",
                "3. View Employees by Department",
                "4. View Employees by Manager",
                "5. View Budget by Department",
                "6. Update Employee Role",
                "7. Update Employee's Manager",
                "8. Add Employee",
                "9. Add Role",
                "10. Add Department",
                "11. Delete Employee",
                "12. Delete Role",
                "13. Delete Department",
                "Exit",
            ],
        })
        .then((response) => {
            switch (response.action) {
                // View employees then show the options
                case "1. View all Employees":
                    viewEmployees().then(start);
                    break;
                // View Employees by Role then show the options
                case "2. View Employees by Role":
                    var temp = connection.query(
                        "SELECT roles.id AS Role_ID, roles.title AS Role_Title, roles.salary AS Role_Salary, roles.department_id AS Role_Dept FROM roles ORDER BY roles.id;",
                        function (error, temp) {
                            if (error) throw error;
                            console.table(temp);
                        }
                    );
                    viewEmployeesByRole().then(start);
                    break;
                // View Employees by Department then show the options
                case "3. View Employees by Department":
                    viewEmployeesByDepartment().then(start);
                    break;
                // View Employees by Manager then show the options
                case "4. View Employees by Manager":
                    viewEmployeesByManager().then(start);
                    break;
                // View Total Budget by Department then show the options
                case "5. View Budget by Department":
                    viewBudgetByDepartment().then(start);
                    break;
                // Update Employee Role then show the options
                case "6. Update Employee Role":
                    connection.query("SELECT * FROM employee", function (err, result) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "employee",
                                    type: "list",
                                    message: "Please select employee",
                                    choices: function () {
                                        var choiceArray = [];
                                        for (var i = 0; i < result.length; i++) {
                                            choiceArray.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                                        }
                                        return choiceArray;
                                    },
                                },
                                {
                                    name: "roleId",
                                    type: "input",
                                    message: "Please enter role's id",
                                },
                            ])
                            .then((response) => {
                                const employee = response.employee;
                                const employeeString = employee.split(" ");
                                const employeeId = employeeString[0];
                                const roleId = response.roleId;
                                var temp1 =
                                    "UPDATE employee SET role_id = '" +
                                    roleId +
                                    "' WHERE id= '" +
                                    employeeId +
                                    "'";
                                var updateRole = connection.query(temp1, (error, updateRole) => {
                                    if (error) throw error;
                                });
                                viewEmployees().then(start);
                            });
                    });
                    break;

                // Update Employee Role then show the options
                case "7. Update Employee's Manager":
                    connection.query("SELECT * FROM employee", function (err, result) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "employee",
                                    type: "list",
                                    message: "Please select employee",
                                    choices: function () {
                                        var choiceArray = [];
                                        for (var i = 0; i < result.length; i++) {
                                            choiceArray.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                                        }
                                        return choiceArray;
                                    },
                                },
                                {
                                    name: "managerId",
                                    type: "input",
                                    message: "Please enter manager's id",
                                },
                            ])
                            .then((response) => {
                                const employee = response.employee;
                                const employeeString = employee.split(" ");
                                const employeeId = employeeString[0];
                                const managerId = response.managerId;
                                var temp1 =
                                    "UPDATE employee SET manager_id = '" +
                                    managerId +
                                    "' WHERE id= '" +
                                    employeeId +
                                    "'";
                                var updateRole = connection.query(temp1, (error, updateRole) => {
                                    if (error) throw error;
                                });
                                viewEmployees().then(start);
                            });
                    });
                    break;
                // Add Employee then show the options
                case "8. Add Employee":
                    inquirer
                        .prompt([
                            {
                                name: "employeeFirst",
                                type: "input",
                                message: "What is the employee's first name?",
                                validate: (response) => {
                                    if (response !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                },
                            },
                            {
                                name: "employeeLast",
                                type: "input",
                                message: "What is the employee's last name?",
                                validate: (response) => {
                                    if (response !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                },
                            },
                            {
                                name: "roleId",
                                type: "input",
                                message: "Please enter the role",
                            },
                            {
                                name: "managerId",
                                type: "input",
                                message: "Please enter manager id",
                            },
                        ])
                        .then((response) => {
                            // Adds an employee to database
                            const first = response.employeeFirst;
                            const last = response.employeeLast;
                            const roleId = response.roleId;
                            const mgrId = response.managerId;
                            var temp =
                                "INSERT INTO employee SET first_name = '" +
                                first +
                                "', last_name = '" +
                                last +
                                "', role_id = '" +
                                roleId +
                                "', manager_id = '" +
                                mgrId +
                                "'";
                            var add = connection.query(temp, function (error, add) {
                                if (error) throw error;
                            });
                            viewEmployees().then(start);
                        });
                    break;
                // Add Role then show the options
                case "9. Add Role":
                    inquirer
                        .prompt([
                            {
                                name: "title",
                                type: "input",
                                message: "Please enter the role's title.",
                                validate: (response) => {
                                    if (response !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                },
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "Please enter the role's salary.",
                            },
                            {
                                name: "department_id",
                                type: "input",
                                message: "Please enter the department id.",
                            },
                        ])
                        .then((response) => {
                            // Adds role to database
                            const title = response.title;
                            const salary = response.salary;
                            const dept = response.department_id;
                            var temp =
                                "INSERT INTO roles SET title = '" +
                                title +
                                "', salary = '" +
                                salary +
                                "', department_id = '" +
                                dept +
                                "'";
                            var add = connection.query(temp, function (error, add) {
                                if (error) throw error;
                            });
                            var temp = connection.query(
                                "SELECT roles.id AS Role_ID, roles.title AS Role_Title, roles.salary AS Role_Salary, roles.department_id AS Role_Dept FROM roles ORDER BY roles.id;",
                                function (error, temp) {
                                    if (error) throw error;
                                    console.table(temp);
                                }
                            );
                            viewEmployeesByRole().then(start);
                        });
                    break;
                // Add Department then show the options
                case "10. Add Department":
                    inquirer
                        .prompt([
                            {
                                name: "department_name",
                                type: "input",
                                message:
                                    "Please enter the department name you would like to add?",
                                validate: (response) => {
                                    if (response !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                },
                            },
                        ])
                        .then((response) => {
                            // Adds department to database
                            const department_name = response.department_name;
                            var temp =
                                "INSERT INTO department SET department_name = '" +
                                department_name +
                                "'";
                            var add = connection.query(temp, function (error, add) {
                                if (error) throw error;
                            });
                            var temp = connection.query(
                                "SELECT department.id AS Dept_ID, department.department_name AS Dept FROM department ORDER BY department.id;",
                                function (error, temp) {
                                    if (error) throw error;
                                    console.table(temp);
                                }
                            );
                            viewEmployees().then(start);
                        });
                    break;
                // Delete Employee then show the options
                case "11. Delete Employee":
                    connection.query("SELECT * FROM employee", function (err, result) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "employee",
                                    type: "list",
                                    message: "Please select employee",
                                    choices: function () {
                                        var choiceArray = [];
                                        for (var i = 0; i < result.length; i++) {
                                            choiceArray.push(result[i].id + " " + result[i].first_name + " " + result[i].last_name);
                                        }
                                        return choiceArray;
                                    },
                                },
                            ])
                            .then((response) => {
                                // Removes employee to database
                                const employee = response.employee;
                                const employeeString = employee.split(" ");
                                const employeeId = employeeString[0];
                                var temp = "DELETE FROM employee WHERE id ='" + employeeId + "'";
                                var add = connection.query(temp, function (error, add) {
                                    if (error) throw error;
                                });
                                viewEmployees().then(start);
                            });
                    });
                    break;
                // Delete Role then show the options
                case "12. Delete Role":
                    connection.query("SELECT * FROM roles", function (err, result) {
                        if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "role",
                                type: "list",
                                message: "Please select role",
                                choices: function () {
                                    var choiceArray = [];
                                    for (var i = 0; i < result.length; i++) {
                                        choiceArray.push(result[i].id + " " + result[i].title);
                                    }
                                    return choiceArray;
                                },
                            },
                        ])
                        .then((response) => {
                            // Removes role from database
                            const role = response.role;
                            const roleString = role.split(" ");
                            const roleId = roleString[0];
                            var temp = "DELETE FROM roles WHERE id = '" + roleId + "'";
                            var add = connection.query(temp, function (error, add) {
                                if (error) throw error;
                            });
                            var temp = connection.query(
                                "SELECT roles.id AS Role_ID, roles.title AS Role_Title, roles.salary AS Role_Salary, roles.department_id AS Role_Dept FROM roles ORDER BY roles.id;",
                                function (error, temp) {
                                    if (error) throw error;
                                    console.table(temp);
                                }
                            );
                            viewEmployeesByRole().then(start);
                        });
                    });
                    break;
                // Delete Department then show the options
                case "13. Delete Department":
                    connection.query("SELECT * FROM department", function (err, result) {
                        if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "department",
                                type: "list",
                                message: "Please select department",
                                choices: function () {
                                    var choiceArray = [];
                                    for (var i = 0; i < result.length; i++) {
                                        choiceArray.push(result[i].id + " " + result[i].department_name);
                                    }
                                    return choiceArray;
                                },
                            },
                        ])
                        .then((response) => {
                            // Removes employee to database
                            const department = response.department;
                            const departmentString = department.split(" ");
                            const departmentId = departmentString[0];
                            var temp = "DELETE FROM department WHERE id = '" + departmentId + "'";
                            var add = connection.query(temp, function (error, add) {
                                if (error) throw error;
                            });
                            viewEmployeesByDepartment().then(start);
                        });
                    });
                    break;
                // Exit if no changes required
                case "Exit":
                    console.log("Thank you for using Employee Tracker")
                    break;
            }
        });
}

//-------------------------------------------------------------------------------------------->

// View all Employees as a promise
const viewEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, roles.title AS Title, department.department_name AS Dept, roles.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
            function (error, employee) {
                if (error) reject(error);
                console.table(employee);
                resolve();
            }
        );
    });
};

const viewEmployeesByRole = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT employee.role_id AS Role_ID, employee.id AS Emp_ID, employee.first_name AS First, employee.last_name AS Last, employee.Manager_id AS Mgr_ID FROM employee LEFT JOIN roles on employee.role_id = roles.id ORDER BY employee.role_id",
            function (error, role) {
                if (error) reject(error);
                console.table(role);
                resolve();
            }
        );
    });
};

const viewEmployeesByDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, department.department_name AS Dept FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department department on roles.department_id = department.id ORDER BY department.id;",
            function (error, results) {
                if (error) reject(error);
                console.table(results);
                resolve();
            }
        );
    });
};

const viewEmployeesByManager = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, roles.title AS Title, department.department_name AS Department, employee.manager_id, manager.manager_name AS Manager FROM employee LEFT JOIN manager on manager.id = employee.manager_id LEFT JOIN roles on roles.id = employee.role_id LEFT JOIN department ON department.id = roles.department_id WHERE manager_id;",
            function (error, results) {
                if (error) reject(error);
                console.table(results);
                resolve();
            }
        );
    });
};

const viewBudgetByDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT department_id AS ID, department.department_name AS Dept, SUM(salary) AS Amount FROM roles LEFT JOIN department on roles.department_id = department.id GROUP BY department_id", // LEFT JOIN department.department.id ON role.department_name = role.department.id",
            function (error, results) {
                if (error) reject(error);
                console.table(results);
                resolve();
            }
        );
    });
};
