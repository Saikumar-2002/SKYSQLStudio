const express = require('express');
const router = express.Router();

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// --------------- Demo Data ---------------
const DEMO_ASSIGNMENTS = [
    {
        _id: 'assign_001',
        title: 'Retrieve All Employees',
        difficulty: 'Easy',
        description: 'Learn the basics of SELECT statements by retrieving all records from the employees table.',
        instructions: 'Write a SQL query to retrieve all columns and all rows from the `employees` table. Use the SELECT * syntax.',
        order: 1,
        pgSchemaName: 'assignment_1',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'email', type: 'VARCHAR(100)' },
                    { name: 'department', type: 'VARCHAR(50)' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                    { name: 'hire_date', type: 'DATE' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000, '2021-03-15'],
                    [2, 'Bob', 'Smith', 'bob@company.com', 'Marketing', 65000, '2020-07-01'],
                    [3, 'Carol', 'Williams', 'carol@company.com', 'Engineering', 92000, '2019-11-20'],
                    [4, 'David', 'Brown', 'david@company.com', 'Sales', 58000, '2022-01-10'],
                    [5, 'Eva', 'Davis', 'eva@company.com', 'Engineering', 78000, '2021-06-25'],
                    [6, 'Frank', 'Miller', 'frank@company.com', 'Marketing', 62000, '2020-09-14'],
                    [7, 'Grace', 'Wilson', 'grace@company.com', 'Sales', 71000, '2019-04-30'],
                    [8, 'Henry', 'Moore', 'henry@company.com', 'Engineering', 95000, '2018-12-01']
                ]
            }
        ],
        expectedQuery: 'SELECT * FROM employees;'
    },
    {
        _id: 'assign_002',
        title: 'Filter by Department',
        difficulty: 'Easy',
        description: 'Practice using WHERE clause to filter records based on specific conditions.',
        instructions: 'Write a SQL query to retrieve all employees who work in the **Engineering** department. Return all columns.',
        order: 2,
        pgSchemaName: 'assignment_1',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'email', type: 'VARCHAR(100)' },
                    { name: 'department', type: 'VARCHAR(50)' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                    { name: 'hire_date', type: 'DATE' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000, '2021-03-15'],
                    [2, 'Bob', 'Smith', 'bob@company.com', 'Marketing', 65000, '2020-07-01'],
                    [3, 'Carol', 'Williams', 'carol@company.com', 'Engineering', 92000, '2019-11-20'],
                    [4, 'David', 'Brown', 'david@company.com', 'Sales', 58000, '2022-01-10'],
                    [5, 'Eva', 'Davis', 'eva@company.com', 'Engineering', 78000, '2021-06-25'],
                    [6, 'Frank', 'Miller', 'frank@company.com', 'Marketing', 62000, '2020-09-14'],
                    [7, 'Grace', 'Wilson', 'grace@company.com', 'Sales', 71000, '2019-04-30'],
                    [8, 'Henry', 'Moore', 'henry@company.com', 'Engineering', 95000, '2018-12-01']
                ]
            }
        ],
        expectedQuery: "SELECT * FROM employees WHERE department = 'Engineering';"
    },
    {
        _id: 'assign_003',
        title: 'Join Employees & Departments',
        difficulty: 'Medium',
        description: 'Learn INNER JOIN by combining data from employees and departments tables.',
        instructions: 'Write a SQL query to retrieve each employee\'s **first_name**, **last_name**, and their **department_name** by joining the `employees` table with the `departments` table on `department_id`.',
        order: 3,
        pgSchemaName: 'assignment_2',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'department_id', type: 'INTEGER' },
                    { name: 'salary', type: 'DECIMAL(10,2)' }
                ]
            },
            {
                tableName: 'departments',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'department_name', type: 'VARCHAR(50)' },
                    { name: 'location', type: 'VARCHAR(100)' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 1, 85000],
                    [2, 'Bob', 'Smith', 2, 65000],
                    [3, 'Carol', 'Williams', 1, 92000],
                    [4, 'David', 'Brown', 3, 58000],
                    [5, 'Eva', 'Davis', 1, 78000]
                ]
            },
            {
                tableName: 'departments',
                rows: [
                    [1, 'Engineering', 'Building A'],
                    [2, 'Marketing', 'Building B'],
                    [3, 'Sales', 'Building C'],
                    [4, 'HR', 'Building A']
                ]
            }
        ],
        expectedQuery: 'SELECT e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;'
    },
    {
        _id: 'assign_004',
        title: 'Department Salary Statistics',
        difficulty: 'Medium',
        description: 'Practice GROUP BY and aggregate functions to compute statistics per department.',
        instructions: 'Write a SQL query that shows each **department**, the **number of employees**, and the **average salary** for that department. Only include departments with more than 1 employee. Use `HAVING` clause.',
        order: 4,
        pgSchemaName: 'assignment_1',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'department', type: 'VARCHAR(50)' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                    { name: 'hire_date', type: 'DATE' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                    [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                    [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20'],
                    [4, 'David', 'Brown', 'Sales', 58000, '2022-01-10'],
                    [5, 'Eva', 'Davis', 'Engineering', 78000, '2021-06-25'],
                    [6, 'Frank', 'Miller', 'Marketing', 62000, '2020-09-14'],
                    [7, 'Grace', 'Wilson', 'Sales', 71000, '2019-04-30'],
                    [8, 'Henry', 'Moore', 'Engineering', 95000, '2018-12-01']
                ]
            }
        ],
        expectedQuery: "SELECT department, COUNT(*) AS employee_count, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING COUNT(*) > 1;"
    },
    {
        _id: 'assign_005',
        title: 'Above Average Salary',
        difficulty: 'Hard',
        description: 'Use subqueries to find employees earning above the company average.',
        instructions: 'Write a SQL query to find all employees whose **salary** is above the **overall average salary** of all employees. Return their **first_name**, **last_name**, **salary**, and the **average salary** of all employees (as a column named `company_avg`). Use a subquery.',
        order: 5,
        pgSchemaName: 'assignment_1',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'department', type: 'VARCHAR(50)' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                    { name: 'hire_date', type: 'DATE' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                    [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                    [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20'],
                    [4, 'David', 'Brown', 'Sales', 58000, '2022-01-10'],
                    [5, 'Eva', 'Davis', 'Engineering', 78000, '2021-06-25'],
                    [6, 'Frank', 'Miller', 'Marketing', 62000, '2020-09-14'],
                    [7, 'Grace', 'Wilson', 'Sales', 71000, '2019-04-30'],
                    [8, 'Henry', 'Moore', 'Engineering', 95000, '2018-12-01']
                ]
            }
        ],
        expectedQuery: "SELECT first_name, last_name, salary, (SELECT AVG(salary) FROM employees) AS company_avg FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"
    },
    {
        _id: 'assign_006',
        title: 'Rank Employees by Salary',
        difficulty: 'Hard',
        description: 'Master window functions by ranking employees within each department.',
        instructions: 'Write a SQL query that ranks employees within each **department** by their **salary** in descending order. Use `RANK()` window function. Return **first_name**, **last_name**, **department**, **salary**, and the **rank** (as `salary_rank`).',
        order: 6,
        pgSchemaName: 'assignment_1',
        sampleSchema: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR(50)' },
                    { name: 'last_name', type: 'VARCHAR(50)' },
                    { name: 'department', type: 'VARCHAR(50)' },
                    { name: 'salary', type: 'DECIMAL(10,2)' },
                    { name: 'hire_date', type: 'DATE' }
                ]
            }
        ],
        sampleData: [
            {
                tableName: 'employees',
                rows: [
                    [1, 'Alice', 'Johnson', 'Engineering', 85000, '2021-03-15'],
                    [2, 'Bob', 'Smith', 'Marketing', 65000, '2020-07-01'],
                    [3, 'Carol', 'Williams', 'Engineering', 92000, '2019-11-20'],
                    [4, 'David', 'Brown', 'Sales', 58000, '2022-01-10'],
                    [5, 'Eva', 'Davis', 'Engineering', 78000, '2021-06-25'],
                    [6, 'Frank', 'Miller', 'Marketing', 62000, '2020-09-14'],
                    [7, 'Grace', 'Wilson', 'Sales', 71000, '2019-04-30'],
                    [8, 'Henry', 'Moore', 'Engineering', 95000, '2018-12-01']
                ]
            }
        ],
        expectedQuery: "SELECT first_name, last_name, department, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM employees;"
    }
];

// --------------- Routes ---------------

// GET /api/assignments — list all
router.get('/', async (req, res) => {
    try {
        if (DEMO_MODE) {
            const simplified = DEMO_ASSIGNMENTS.map(a => ({
                _id: a._id,
                title: a.title,
                difficulty: a.difficulty,
                description: a.description,
                order: a.order
            }));
            return res.json({ assignments: simplified });
        }

        const Assignment = require('../models/Assignment');
        const assignments = await Assignment.find({})
            .select('title difficulty description order')
            .sort({ order: 1 });

        res.json({ assignments });
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ error: 'Failed to fetch assignments.' });
    }
});

// GET /api/assignments/:id — get one with full details
router.get('/:id', async (req, res) => {
    try {
        if (DEMO_MODE) {
            const assignment = DEMO_ASSIGNMENTS.find(a => a._id === req.params.id);
            if (!assignment) {
                return res.status(404).json({ error: 'Assignment not found.' });
            }
            return res.json({ assignment });
        }

        const Assignment = require('../models/Assignment');
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        res.json({ assignment });
    } catch (err) {
        console.error('Error fetching assignment:', err);
        res.status(500).json({ error: 'Failed to fetch assignment.' });
    }
});

module.exports = router;
