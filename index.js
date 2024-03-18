const inquirer = require("inquirer");
const { departments, roles, employees, addDepartment, addRole, addEmployee, updateEmployee } = require('./assets/db-functions');

const userPrompt = [
  {
    type: "list",
    message: 'Welcome to the Employee Tracker! Please choose from the following to access and edit the database.',
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
        init();
      case "View all roles":
        roles();
        init();
      case "View all employees":
        employees();
        init();
      case "Add a department":
        addDepartment();
        init();
      case "Add a role":
        addRole();
        init(); 
      case "Add an employee":
        addEmployee();
        init();
      case "Update an employee role":
        updateEmployee();
        init();
      default:
        console.log('Somehow you chose something not on the list. Please try again');
        init();
    }
  });
};

init();