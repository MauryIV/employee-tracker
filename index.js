const inquirer = require("inquirer");
const { departments, roles, employees, addDepartment, addRole, addEmployee, updateEmployee } = require('./assets/db-functions');

const userPrompt = [
  {
    type: "list",
    message: '\nPlease choose from the following to access and edit the database.',
    name: "userChoice",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
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
      default:
        console.log('Somehow you chose something not on the list. Please try again');
    }
    init();
  });
};

init();

module.exports = { init }