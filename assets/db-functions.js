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

// function deptEmployees() {
//   const getSql = `SELECT employee.id AS "Employee ID", 
// employee.first_name AS "First Name", 
// employee.last_name AS "Last Name", 
// department.dept_name AS "Department", 
// role.title AS "Title", 
// role.salary AS "Salary", 
// CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
// FROM employee 
// LEFT JOIN role ON role.id = employee.role_id 
// LEFT JOIN department ON department.id = role.dept_id 
// LEFT JOIN employee manager ON manager.id = employee.manager_id 
// ORDER BY department.dept_name ASC, employee.last_name ASC`;
// const allDept = result.rows.map(row => row.Department);
//   const viewByDept = [
//     {
//       type: "list",
//       message: "Please choose the department you'd like to see.",
//       name: "deptName",
//       choices: allDept
//     }
//   ]
//   inquirer.prompt(viewByDept)
//   .then((chosenDept) => {
//     const employeesInDept = result.rows.forEach(row => row.Department === chosenDept.allDept);
//     pool.query(getSql, (err, result) => {
//       const table = new Table({
//         head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
//       });
//       if (err) {
//         console.error('Having this issue: ', err);
//       } else {
//         result.rows.forEach(row => {
//           const managerName = row['Manager Name'] ? row['Manager Name'] : '';
//           table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
//         });
//         console.log(table.toString());
//       }
//     });
//   });
// };

function deptEmployees() {
  const getDeptSql = `SELECT department.dept_name AS "Department", 
  id AS "Department ID" 
  FROM department 
  ORDER BY department.dept_name`;
  const getEmplSql = `SELECT employee.id AS "Employee ID", 
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

  pool.query(getDeptSql, (err, deptResult) => {
    if (err) {
      console.error('Having this issue: ', err);
      return;
    }
    const allDept = deptResult.rows.map(row => row.Department);
    const viewByDept = [
      {
        type: "list",
        message: "Please choose the department you'd like to see.",
        name: "deptName",
        choices: allDept
      }
    ];
    pool.query(getEmplSql, (err, emplResult) => {
      if (err) {
        console.error('Having this issue: ', err);
        return;
      }
      inquirer.prompt(viewByDept)
        .then((chosenDept) => {
          const employeesInDept = emplResult.rows.filter(row => row.Department === chosenDept.deptName);
          const table = new Table({
            head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
          });
          employeesInDept.forEach(row => {
            const managerName = row['Manager Name'] ? row['Manager Name'] : '';
            table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
          });
          console.log(table.toString());
        });
      });
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
  const getSql = `SELECT department.dept_name AS "Department", department.id
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
      const chosenDept = result.rows.find(row => row.Department === newRole.roleDept);
      const editSql = `INSERT INTO role (title, salary, dept_id) VALUES ('${newRole.roleName}', ${newRole.roleSalary}, ${chosenDept.id})`;
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
  const getSql = `SELECT role.title AS "Title", role.id FROM role ORDER BY title`;
  pool.query(getSql, (err, result) => {
    if (err) {
      console.error('Having this issue: ', err);
      return;
    }
    const allTitles = result.rows.map(row => row.Title);
    const addEmployee = [
      {
        type: "input",
        message: "Please enter the first name of the new employee.",
        name: "firstName"
      },
      {
        type: "input",
        message: "Please enter the last name of the new employee.",
        name: "lastName"
      },
      {
        type: "list",
        message: "Please choose the employee's title.",
        name: "title",
        choices: allTitles
      },
      {
        type: "confirm",
        message: "Does this person have a manager?",
        name: "hasManager",
        default: true
      }
    ];
    inquirer.prompt(addEmployee)
    .then((newEmployee) => {
      const chosenRole = result.rows.find(row => row.Title === newEmployee.title);
      if (newEmployee.hasManager) {
        addManager(newEmployee, chosenRole);
      } else {
        const editSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmployee.firstName}', '${newEmployee.lastName}', ${chosenRole.id}, NULL)`;
        pool.query(editSql, (err) => {
          if (err) {
            console.error('Having this issue: ', err);
          } else {
            console.log('New Employee added successfully!');
          }
        })
      };
    });
  });
};

function addManager(newEmployee, chosenRole) {
  const getSql = `SELECT employee.last_name AS "Last", employee.first_name AS "First", employee.id AS "ID"
FROM employee ORDER BY last_name`;
  pool.query(getSql, (err, result) => {
    if (err) {
      console.error('Having this issue: ', err);
      return;
    }
    result.rows.map(row => row.Title);
    const allEmployees = result.rows.map(row => `${row.ID}: ${row.Last}, ${row.First}`)
    const addManager = [
      {
        type: "list",
        message: "Who is this person's manager?",
        name: "managerId",
        choices: allEmployees
      }
    ];
    inquirer.prompt(addManager)
    .then((managerTrue) => {
      const chosenManager = result.rows.find(row => row.ID.toString() === managerTrue.managerId.split(':')[0]);
      const editSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmployee.firstName}', '${newEmployee.lastName}', ${chosenRole.id}, ${chosenManager.ID})`;
      pool.query(editSql, (err) => {
        if (err) {
          console.error('Having this issue: ', err);
        } else {
          console.log('New Employee added successfully!');
        }
      });
    });
  });
};

function updateEmployee() {
  const getSql = `SELECT employee.id AS "ID", 
  employee.first_name AS "First", 
  employee.last_name AS "Last", 
  department.dept_name AS "Department", 
  role.title AS "Title", 
  role.salary AS "Salary", 
  CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager" 
  FROM employee 
  LEFT JOIN role ON role.id = employee.role_id 
  LEFT JOIN department ON department.id = role.dept_id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id 
  ORDER BY employee.last_name ASC`;
  pool.query(getSql, (err, result) => {
    const table = new Table({
    head: ['ID', 'Last', 'First', 'Department', 'Title', 'Salary', 'Manager']
    });
    if (err) {
      console.error('Having this issue: ', err);
    } else {
      result.rows.forEach(row => {
        const managerName = row['Manager'] ? row['Manager'] : '';
        table.push([row['ID'], row['Last'], row['First'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
      const everyone = result.rows.map(row => (`ID ${row.ID}: ${row.Last}, ${row.First} - ${row.Title} in ${row.Department}, ${row.Salary}/annually - ManagerID ${row.Manager}`));
      const editPerson = [
        {
          type: "list",
          message: "Please choose the employee whose information you would like to edit.",
          name: "thePerson",
          choices: everyone
        },
        {
          type: "list",
          message: "What would you like to edit?",
          name: "value",
          choices:  ["Last", "First", "Title", "Manager"]
        }
        ]
        inquirer.prompt(editPerson)
        .then((chosenEmployee) => {
          const chosenEmployeeId = parseInt(chosenEmployee.thePerson.split(' ')[1]);
          const employeeToEdit = result.rows.find(row => row.ID === chosenEmployeeId);

          if (employeeToEdit) {
            const editOptions = {
              Last: "last_name",
              First: "first_name",
              Title: "role_id",
              Manager: "manager_id"
            };
            inquirer.prompt({
              type: "input",
              message: `Enter new ${editOptions[chosenEmployee.value]}:`,
              name: "updatedInfo"
            })
            .then((userResponse) => {
              updateSql = `UPDATE employee SET ${editOptions[chosenEmployee.value]} = '${userResponse.updatedInfo}' WHERE id = ${employeeToEdit.ID}`;
              pool.query(updateSql, (err, updateResult) => {
                if (err) {
                  console.error('Having this issue: ', err);
                } else {
                  console.log('Employee updated successfully!');
                }
              });
            });
          } else {
            console.log('Employee not found');
          }
        });
      }
    });
  };

module.exports = { departments, roles, employees, deptEmployees, addDepartment, addRole, addEmployee, updateEmployee }
