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
  const getSql = 'SELECT department.dept_name AS "Department", id AS "Department ID" FROM department ORDER BY department.dept_name';
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

};
function employees() {

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