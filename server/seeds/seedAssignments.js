/**
 * Seed MongoDB with sample assignments.
 * Run: node seeds/seedAssignments.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const assignments = [
    {
        title: 'Retrieve All Employees',
        difficulty: 'Easy',
        description: 'Learn the basics of SELECT statements by retrieving all records from the employees table.',
        instructions: 'Write a SQL query to retrieve all columns and all rows from the `employees` table. Use the SELECT * syntax.',
        order: 1,
        pgSchemaName: 'assignment_1',
        sampleSchema: [{
            tableName: 'employees', columns: [
                { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'email', type: 'VARCHAR(100)' },
                { name: 'department', type: 'VARCHAR(50)' }, { name: 'salary', type: 'DECIMAL(10,2)' },
                { name: 'hire_date', type: 'DATE' }
            ]
        }],
        sampleData: [{
            tableName: 'employees', rows: [
                [1, 'Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000, '2021-03-15'],
                [2, 'Bob', 'Smith', 'bob@company.com', 'Marketing', 65000, '2020-07-01'],
                [3, 'Carol', 'Williams', 'carol@company.com', 'Engineering', 92000, '2019-11-20'],
                [4, 'David', 'Brown', 'david@company.com', 'Sales', 58000, '2022-01-10'],
                [5, 'Eva', 'Davis', 'eva@company.com', 'Engineering', 78000, '2021-06-25'],
                [6, 'Frank', 'Miller', 'frank@company.com', 'Marketing', 62000, '2020-09-14'],
                [7, 'Grace', 'Wilson', 'grace@company.com', 'Sales', 71000, '2019-04-30'],
                [8, 'Henry', 'Moore', 'henry@company.com', 'Engineering', 95000, '2018-12-01']
            ]
        }],
        expectedQuery: 'SELECT * FROM employees;'
    },
    {
        title: 'Filter by Department',
        difficulty: 'Easy',
        description: 'Practice using WHERE clause to filter records.',
        instructions: 'Write a SQL query to retrieve all employees who work in the Engineering department.',
        order: 2,
        pgSchemaName: 'assignment_1',
        sampleSchema: [{
            tableName: 'employees', columns: [
                { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'email', type: 'VARCHAR(100)' },
                { name: 'department', type: 'VARCHAR(50)' }, { name: 'salary', type: 'DECIMAL(10,2)' },
                { name: 'hire_date', type: 'DATE' }
            ]
        }],
        sampleData: [{
            tableName: 'employees', rows: [
                [1, 'Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000, '2021-03-15'],
                [2, 'Bob', 'Smith', 'bob@company.com', 'Marketing', 65000, '2020-07-01'],
                [3, 'Carol', 'Williams', 'carol@company.com', 'Engineering', 92000, '2019-11-20']
            ]
        }],
        expectedQuery: "SELECT * FROM employees WHERE department = 'Engineering';"
    },
    {
        title: 'Join Employees & Departments',
        difficulty: 'Medium',
        description: 'Learn INNER JOIN by combining data from employees and departments tables.',
        instructions: "Write a SQL query to retrieve each employee's first_name, last_name, and department_name by joining employees with departments on department_id.",
        order: 3,
        pgSchemaName: 'assignment_2',
        sampleSchema: [
            {
                tableName: 'employees', columns: [
                    { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'department_id', type: 'INTEGER' },
                    { name: 'salary', type: 'DECIMAL(10,2)' }
                ]
            },
            {
                tableName: 'departments', columns: [
                    { name: 'id', type: 'INTEGER' }, { name: 'department_name', type: 'VARCHAR(50)' },
                    { name: 'location', type: 'VARCHAR(100)' }
                ]
            }
        ],
        sampleData: [
            { tableName: 'employees', rows: [[1, 'Alice', 'Johnson', 1, 85000], [2, 'Bob', 'Smith', 2, 65000]] },
            { tableName: 'departments', rows: [[1, 'Engineering', 'Building A'], [2, 'Marketing', 'Building B']] }
        ],
        expectedQuery: 'SELECT e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;'
    },
    {
        title: 'Department Salary Statistics',
        difficulty: 'Medium',
        description: 'Practice GROUP BY and aggregate functions.',
        instructions: 'Write a query showing each department, employee count, and avg salary. Only include departments with more than 1 employee using HAVING.',
        order: 4,
        pgSchemaName: 'assignment_1',
        sampleSchema: [{
            tableName: 'employees', columns: [
                { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'department', type: 'VARCHAR(50)' },
                { name: 'salary', type: 'DECIMAL(10,2)' }, { name: 'hire_date', type: 'DATE' }
            ]
        }],
        sampleData: [{
            tableName: 'employees', rows: [
                [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20']
            ]
        }],
        expectedQuery: "SELECT department, COUNT(*) AS employee_count, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING COUNT(*) > 1;"
    },
    {
        title: 'Above Average Salary',
        difficulty: 'Hard',
        description: 'Use subqueries to find employees earning above average.',
        instructions: "Find employees whose salary is above the overall average. Return first_name, last_name, salary, and the average as 'company_avg'. Use a subquery.",
        order: 5,
        pgSchemaName: 'assignment_1',
        sampleSchema: [{
            tableName: 'employees', columns: [
                { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'department', type: 'VARCHAR(50)' },
                { name: 'salary', type: 'DECIMAL(10,2)' }, { name: 'hire_date', type: 'DATE' }
            ]
        }],
        sampleData: [{
            tableName: 'employees', rows: [
                [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20']
            ]
        }],
        expectedQuery: "SELECT first_name, last_name, salary, (SELECT AVG(salary) FROM employees) AS company_avg FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"
    },
    {
        title: 'Rank Employees by Salary',
        difficulty: 'Hard',
        description: 'Master window functions by ranking employees within departments.',
        instructions: "Rank employees within each department by salary (DESC) using RANK() window function. Return first_name, last_name, department, salary, and rank as 'salary_rank'.",
        order: 6,
        pgSchemaName: 'assignment_1',
        sampleSchema: [{
            tableName: 'employees', columns: [
                { name: 'id', type: 'INTEGER' }, { name: 'first_name', type: 'VARCHAR(50)' },
                { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'department', type: 'VARCHAR(50)' },
                { name: 'salary', type: 'DECIMAL(10,2)' }, { name: 'hire_date', type: 'DATE' }
            ]
        }],
        sampleData: [{
            tableName: 'employees', rows: [
                [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20']
            ]
        }],
        expectedQuery: "SELECT first_name, last_name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM employees;"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SKYSQLStudio');
        console.log('🌱 Seeding MongoDB assignments...');
        await Assignment.deleteMany({});
        await Assignment.insertMany(assignments);
        console.log(`  ✅ ${assignments.length} assignments inserted`);
        console.log('🎉 MongoDB seeding complete!');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
