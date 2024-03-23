const inquirer = require("inquirer");
const { departments, deleteDepartment, roles, deleteRole, employees, deleteEmployee, managerEmployees, deptEmployees, departmentSalaryTotal, addDepartment, addRole, addEmployee, updateEmployee } = require('./assets/db-functions');

const userPrompt = [
  {
    type: "list",
    message: '\nPlease choose from the following to access and edit the database.',
    name: "userChoice",
    choices: ["View all departments", "View all roles", "View all employees", "View all employees under specified manager", "View all employees in specified department", "View the salary total in a department", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Delete a department", "Delete a role", "Delete an employee"]
  }
];

function init() {
  inquirer.prompt(userPrompt)
  .then((userInput) => {
    switch (userInput.userChoice) {
      case "View all departments":
        departments();
        break;
      case "View all roles":
        roles();
        break;
      case "View all employees":
        employees();
        break;
      case "View all employees under specified manager":
        managerEmployees();
        break;
      case "View all employees in specified department":
        deptEmployees();
        break;
      case "View the salary total in a department":
        departmentSalaryTotal();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        break; 
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
        break;
      case "Delete a department":
        deleteDepartment();
        break;
      case "Delete a role":
        deleteRole();
        break;
      case "Delete an employee":
        deleteEmployee();
        break;
      default:
        console.log('Somehow you chose something not on the list. Please try again');
    }
    init();
  });
};

init();

module.exports = { init }