const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
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
                "View all Employees",
                "View Employees by Role",
                "View Employees by Department",
                "View Employees by Manager",
                "View Total Budget by Department",
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
                    viewEmployees().then(start);
                    break;
                // View Employees by Role then show the options
                case "View Employees by Role":
                    viewEmployeesByRole().then(start);
                    break;
                // View Employees by Department then show the options
                case "View Employees by Department":
                    viewEmployeesByDepartment().then(start);
                    break;
                // View Employees by Manager then show the options
                case "View Employees by Manager":
                    viewEmployeesByManager().then(start);
                    break;
                // View Total Budget by Department then show the options
                case "View Total Budget by Department":
                    viewBudgetByDepartment();
                    break;
                // Update Employee Role then show the options
                case "Update Employee Role":
                    inquirer
                        .prompt([
                            {
                                name: "employeeId",
                                type: "input",
                                message: "Please enter employee's id" + ' (Current ID is XX)',
                            },
                            {
                                name: "roleId",
                                type: "input",
                                message: "Please enter role's id",
                            },
                        ])
                        .then((response) => {
                            const employeeId = response.employeeId;
                            const roleId = response.roleId;
                            var temp = "UPDATE employee SET role_id = '" + roleId + "' WHERE id= '" + employeeId + "'";
                            var updateRole = connection.query(
                                temp, (error, updateRole) => {
                                    if (error) throw error;
                                }
                            );
                            viewEmployees().then(start);
                        })
                    //   // Updates employee's role
                    //   updateEmployeeRole(response.employeeId, response.roleId);
                    break;
                // Update Employee Department then show the options
                case "Update Employee Department":
                    inquirer
                        .prompt([
                            {
                                name: "employeeId",
                                type: "input",
                                message: "Please enter employee's id",
                            },
                            {
                                name: "departmentId",
                                type: "input",
                                message: "Please enter departments's id",
                            },
                        ])
                        .then((response) => {
                            const employeeId = response.employeeId;
                            const departmentId = response.departmentId;
                            var temp = "UPDATE role SET department_id = '" + departmentId + "' WHERE id= '" + employeeId + "'";
                            var updateRole = connection.query(
                                temp, (error, updateRole) => {
                                    if (error) throw error;
                                }
                            );
                            viewEmployees().then(start);
                        });
                    break;
                // Update Employee Manager then show the options
                case "Update employee manager":
                    inquirer
                        .prompt([
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            },
                            {
                                name: "employeeID",
                                type: "input",
                                message: "Please enter employee id",
                            },
                        ])
                        .then((response) => {
                            const employeeID = response.employeeID;
                            const manager = response.manager;
                            var temp = "UPDATE employee SET manager_id = '" + manager + "' WHERE id= '" + employeeID + "'";
                            var updateManager = connection.query(
                                temp, (error, updateManager) => {
                                    if (error) throw error;
                                }
                            );
                            viewEmployees().then(start);
                        });
                    break;
                // Add Employee then show the options
                case "Add Employee":
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
                                name: "department",
                                type: "input",
                                message: "Please enter the role id",
                            },
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            },
                        ])
                        .then((response) => {
                            addEmployee(
                                response.employeeFirst,
                                response.employeeLast,
                                response.department,
                                response.manager
                            );
                            start();
                        });
                    break;
                // Add Role then show the options
                case "Add Role":
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
                            addRole(response.title, response.salary, response.department_id);
                            start();
                        });
                    break;
                // Add Department then show the options
                case "Add Department":
                    inquirer
                        .prompt([
                            {
                                name: "Department",
                                type: "input",
                                message: "Please enter the department you would like to add?",
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
                            addDepartment(response.Department);
                            start();
                        });
                    break;
                // Delete Employee then show the options
                case "Delete Employee":
                    inquirer
                        .prompt([
                            {
                                name: "id",
                                type: "input",
                                message: "Please enter the Employee id",
                            },
                        ])
                        .then((response) => {
                            // Removes employee to database
                            deleteEmployee(response.id);
                            start();
                        });
                    break;
                // Delete Role then show the options
                case "Delete Role":
                    inquirer
                        .prompt([
                            {
                                name: "id",
                                type: "input",
                                message: "Please enter the Role id",
                            },
                        ])
                        .then((response) => {
                            // Removes employee to database
                            deleteRole(response.id);
                            start();
                        });
                    break;
                // Delete Department then show the options
                case "Delete Department":
                    inquirer
                        .prompt([
                            {
                                name: "id",
                                type: "input",
                                message: "Please enter the Role id",
                            },
                        ])
                        .then((response) => {
                            // Removes employee to database
                            deleteDepartment(response.id);
                            start();
                        });
                    break;
                // Exit if no changes required
                case "Exit":
                    break;
            }
        });
}

//-------------------------------------------------------------------------------------------->

// View all Employees as a promise
const viewEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
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
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE role.id;",
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
            "SELECT employee.id, employee.first_name, employee.last_name, department.department_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;",
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
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id;",
            function (error, results) {
                if (error) reject(error);
                console.table(results);
                resolve();
            }
        );
    });
};

function viewBudgetByDepartment() {
    var results = connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id",
        function (error, results) {
            if (error) throw error;
            console.table(results);
        }
    );
}

// // Working
// function updateEmployeeRole(employeeId, roleId) {
//     var updateRole = connection.query(
//         "UPDATE employee SET role_id = ? WHERE id = ?",
//         [roleId, employeeId],
//         (error, updateRole) => {
//             if (error) throw error;
//         }
//     );
//     viewEmployeesByRole();
// }

// const updateEmployeeRole = (employeeId, roleId) => {
//     return new Promise((resolve, reject) => {
//       connection.query(
//         "UPDATE employee SET role_id = ? WHERE id = ?",
//             [roleId, employeeId],
//         function (error, results) {
//           if (error) reject(error);
//           console.table(results);
//           resolve();
//         }
//       );
//     });
//   };

// function updateEmployeeDepartment(departmentId, employeeId) {
//     var updateDepartment = connection.query(
//         "UPDATE employee SET department_id = ? WHERE id = ?",
//         [departmentId, employeeId],
//         function (error, updateDepartment) {
//             if (error) throw error;
//         }
//     );
//     viewEmployeesByDepartment();
// }

function updateEmployeeManager() {
    var updateManager = connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",
        [managerId, employeeId],
        function (error, updateManager) {
            if (error) throw error;
        }
    );
    viewEmployeesByManager();
}

function addEmployee(employeeFirst, employeeLast, department, manager) {
    var add = connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
        [employeeFirst, employeeLast, department, manager],
        function (error, add) {
            if (error) throw error;
        }
    );
    viewEmployees();
}

function showRoles() {
    var roleT = connection.query(
        "SELECT title, salary, department_id FROM role;",
        function (error, roletable) {
            if (error) throw error;
            console.table(roletable);
        }
    );
}

function addRole(title, salary, department_id) {
    var newRole = connection.query(
        "INSERT INTO role SET title = ?, salary = ?, department_id = ?",
        [title, salary, department_id],
        function (error, newRole) {
            if (error) throw error;
        }
    );
    showRoles();
}

function addDepartment() {
    var results = connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id",
        function (error, results) {
            if (error) throw error;
            console.table(results);
        }
    );
}

function deleteEmployee() {
    var add = connection.query(
        "DELETE FROM employee WHERE id = ?",
        [id],
        function (error, id) {
            if (error) throw error;
        }
    );
    viewEmployees();
}

function deleteRole() {
    var add = connection.query(
        "DELETE FROM role WHERE id = ?",
        [id],
        function (error, id) {
            if (error) throw error;
        }
    );

    viewEmployeesByRole();
}

function deleteDepartment() {
    var add = connection.query(
        "DELETE FROM department WHERE id = ?",
        [id],
        function (error, id) {
            if (error) throw error;
        }
    );
    viewEmployeesByDepartment();
}
