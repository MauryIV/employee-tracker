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
employee.manager_id AS "Manager ID" 
FROM employee 
LEFT JOIN role ON role.id = employee.role_id 
LEFT JOIN department ON department.id = role.dept_id 
ORDER BY department.dept_name ASC, employee.last_name ASC`;
  pool.query(getSql, (err, result) => {
    const table = new Table({
      head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager ID']
    });
    if (err) {
      console.error('Having this issue: ', err);
    } else {
      result.rows.forEach(row => {
        const managerID = row['Manager ID'] ? row['Manager ID'] : '';
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerID]);
      });
      console.log(table.toString());
    }
  });
};

function addDepartment() {

};

function addRole() {

};

function addEmployee() {

};

function updateEmployee() {

};

module.exports = { departments, roles, employees, addDepartment, addRole, addEmployee, updateEmployee }