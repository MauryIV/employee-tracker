const inquirer = require("inquirer");
const Table = require('cli-table');
const { Pool } = require('pg');

const pool = new Pool (
  {
    user: 'postgres',
    password: '4444',
    host: 'localhost',
    database: 'employee_db'
  },
  console.log('You have entered the employee database.')
);

function departments() {
  const getSql = `SELECT department.dept_name AS "Department", 
id AS "Department ID" 
FROM department 
ORDER BY department.dept_name`;
  pool.query(getSql, (err, result) => {
    const table = new Table({
      head: ['Department', 'Department ID']
    });
    if (err) {
      console.error('Having this issue: ', err);
    } else {
      console.log('')
      result.rows.forEach(row => {
        table.push([row['Department'], row['Department ID']]);
      });
      console.log(table.toString());
    }
  });
};

function roles() {
  const getSql = `SELECT role.title AS "Title", 
role.id AS "Title ID", 
department.dept_name AS "Department", 
role.salary AS "Salary" 
FROM role 
LEFT JOIN department ON department.id = role.dept_id 
ORDER BY department.dept_name ASC, role.title ASC`;
  pool.query(getSql, (err, result) => {
    const table = new Table({
      head: ['Title', 'Title ID', 'Department', 'Salary']
    });
    if (err) {
      console.error('Having this issue: ', err);
    } else {
      result.rows.forEach(row => {
        table.push([row['Title'], row['Title ID'], row['Department'], row['Salary']]);
      });
      console.log(table.toString());
    }
  });
};

function employees() {
  const getSql = `SELECT employee.id AS "Employee ID", 
employee.first_name AS "First Name", 
employee.last_name AS "Last Name", 
department.dept_name AS "Department", 
role.title AS "Title", 
role.salary AS "Salary", 
CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
FROM employee 
LEFT JOIN role ON role.id = employee.role_id 
LEFT JOIN department ON department.id = role.dept_id 
LEFT JOIN employee manager ON manager.id = employee.manager_id 
ORDER BY department.dept_name ASC, employee.last_name ASC`;
  pool.query(getSql, (err, result) => {
    const table = new Table({
      head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
    });
    if (err) {
      console.error('Having this issue: ', err);
    } else {
      result.rows.forEach(row => {
        const managerName = row['Manager Name'] ? row['Manager Name'] : '';
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
      console.log(table.toString());
    }
  });
};

function addDepartment() {
  const addDept = [
    {
      type: "input",
      message: "Please enter the name of the new department.",
      name: "deptName"
    }
  ];
  inquirer.prompt(addDept)
  .then((newDept) => {
    const editSql = `INSERT INTO department (dept_name) VALUES ('${newDept.deptName}')`
    pool.query(editSql, (err) => {
      if (err) {
        console.error('Having this issue: ', err);
      } else {
        console.log('New department added successfully!');
      }
    });
  });
};

function addRole() {
  const getSql = `SELECT department.dept_name AS "Department", id
  FROM department 
  ORDER BY dept_name`;
  pool.query(getSql, (err, result) => {
    if (err) {
      console.error('Having this issue: ', err);
      return;
    }
    const allDept = result.rows.map(row => row.Department);
    const addRole = [
      {
        type: "input",
        message: "Please enter the name of the new role.",
        name: "roleName"
      },
      {
        type: "input",
        message: "Please enter the Salaray amount of the new role.",
        name: "roleSalary"
      },
      {
        type: "list",
        message: "Please choose what department this role is for.",
        name: "roleDept",
        choices: allDept
      }
    ];
    inquirer.prompt(addRole)
    .then((newRole) => {
      console.log(result.rows)
      const chosenDept = result.rows.find(row => row.Department === newRole.roleDept);
      const editSql = `INSERT INTO role (title, salary, dept_id) VALUES ('${newRole.roleName}', ${newRole.roleSalary}, '${chosenDept.id}')`;
      pool.query(editSql, (err) => {
        if (err) {
          console.error('Having this issue: ', err);
        } else {
          console.log('New role added successfully!');
        }
      });
    });
  });
};

function addEmployee() {

};

function updateEmployee() {

};

module.exports = { departments, roles, employees, addDepartment, addRole, addEmployee, updateEmployee }