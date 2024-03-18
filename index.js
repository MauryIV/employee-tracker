const inquirer = require("inquirer");
const { departments, roles, employees, addDepartment, addRole, addEmployee, updateEmployee } = require('./assets/db-functions');

const userPrompt = [
  {
    type: "list",
    message: "",
    name: "userChoice",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
  }
];

function init() {
  inquirer.prompt(userPrompt)
  .then((userInput) => {
    if (userInput.userChoice === "View all departments") {
      departments();
    } else if (userInput.userChoice === "View all roles") {
      roles();
    } else if (userInput.userChoice === "View all employees") {
      employees();
    } else if (userInput.userChoice === "Add a department") {
      addDepartment();
    } else if (userInput.userChoice === "Add a role") {
      addRole();
    } else if (userInput.userChoice === "Add an employee") {
      addEmployee();
    } else if (userInput.userChoice === "Update an employee role") {
      updateEmployee();
    } else ('Somehow you chose something not on the list. Please try again')
  });
};

init();