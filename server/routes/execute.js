const express = require('express');
const validateSQL = require('../middleware/sqlValidator');
const router = express.Router();

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Demo data for simulating query execution
const DEMO_TABLES = {
    assignment_1: {
        employees: {
            columns: ['id', 'first_name', 'last_name', 'email', 'department', 'salary', 'hire_date'],
            rows: [
                [1, 'Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000.00, '2021-03-15'],
                [2, 'Bob', 'Smith', 'bob@company.com', 'Marketing', 65000.00, '2020-07-01'],
                [3, 'Carol', 'Williams', 'carol@company.com', 'Engineering', 92000.00, '2019-11-20'],
                [4, 'David', 'Brown', 'david@company.com', 'Sales', 58000.00, '2022-01-10'],
                [5, 'Eva', 'Davis', 'eva@company.com', 'Engineering', 78000.00, '2021-06-25'],
                [6, 'Frank', 'Miller', 'frank@company.com', 'Marketing', 62000.00, '2020-09-14'],
                [7, 'Grace', 'Wilson', 'grace@company.com', 'Sales', 71000.00, '2019-04-30'],
                [8, 'Henry', 'Moore', 'henry@company.com', 'Engineering', 95000.00, '2018-12-01']
            ]
        }
    },
    assignment_2: {
        employees: {
            columns: ['id', 'first_name', 'last_name', 'department_id', 'salary'],
            rows: [
                [1, 'Alice', 'Johnson', 1, 85000.00],
                [2, 'Bob', 'Smith', 2, 65000.00],
                [3, 'Carol', 'Williams', 1, 92000.00],
                [4, 'David', 'Brown', 3, 58000.00],
                [5, 'Eva', 'Davis', 1, 78000.00]
            ]
        },
        departments: {
            columns: ['id', 'department_name', 'location'],
            rows: [
                [1, 'Engineering', 'Building A'],
                [2, 'Marketing', 'Building B'],
                [3, 'Sales', 'Building C'],
                [4, 'HR', 'Building A']
            ]
        }
    }
};

/**
 * Simple demo SQL executor — handles basic SELECT queries for demo mode.
 * This is NOT a full SQL parser, just enough to demonstrate the UI.
 */
function executeDemoQuery(query, schemaName) {
    const schema = DEMO_TABLES[schemaName];
    if (!schema) {
        return { error: 'Schema not found for this assignment.' };
    }

    const normalizedQuery = query.trim().replace(/;$/, '').toLowerCase();

    // Try to find which table is being queried
    let matchedTable = null;
    for (const tableName of Object.keys(schema)) {
        if (normalizedQuery.includes(tableName)) {
            matchedTable = tableName;
            break;
        }
    }

    if (!matchedTable) {
        return { error: 'Table not found. Available tables: ' + Object.keys(schema).join(', ') };
    }

    const tableData = schema[matchedTable];
    let resultColumns = [...tableData.columns];
    let resultRows = [...tableData.rows];

    // Handle basic WHERE clause filtering
    const whereMatch = normalizedQuery.match(/where\s+(\w+)\s*=\s*'([^']+)'/i);
    if (whereMatch) {
        const colName = whereMatch[1];
        const colValue = whereMatch[2];
        const colIndex = tableData.columns.indexOf(colName);
        if (colIndex !== -1) {
            resultRows = resultRows.filter(row =>
                String(row[colIndex]).toLowerCase() === colValue.toLowerCase()
            );
        }
    }

    // Handle basic column selection (non-star)
    const selectMatch = normalizedQuery.match(/select\s+(.+?)\s+from/i);
    if (selectMatch && selectMatch[1].trim() !== '*') {
        const selectedCols = selectMatch[1].split(',').map(c => {
            // Handle aliases like "e.first_name"
            const parts = c.trim().split(/\s+as\s+|\./i);
            return parts[parts.length - 1].trim();
        });

        const colIndices = selectedCols.map(col => tableData.columns.indexOf(col)).filter(i => i !== -1);
        if (colIndices.length > 0) {
            resultColumns = colIndices.map(i => tableData.columns[i]);
            resultRows = resultRows.map(row => colIndices.map(i => row[i]));
        }
    }

    return {
        columns: resultColumns,
        rows: resultRows,
        rowCount: resultRows.length,
        executionTime: Math.floor(Math.random() * 50) + 5 + 'ms'
    };
}

// POST /api/execute
router.post('/', validateSQL, async (req, res) => {
    try {
        const { query, assignmentId, schemaName } = req.body;

        if (DEMO_MODE) {
            const pgSchema = schemaName || 'assignment_1';
            const result = executeDemoQuery(query, pgSchema);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            return res.json({ result });
        }

        // Production mode: execute against PostgreSQL
        const { pool } = require('../config/pgPool');
        const pgSchema = schemaName || 'public';

        const client = await pool.connect();
        try {
            // Set search path to the assignment's schema
            await client.query(`SET search_path TO ${pgSchema}, public`);
            await client.query('BEGIN READ ONLY');

            const startTime = Date.now();
            const pgResult = await client.query(query);
            const executionTime = Date.now() - startTime;

            await client.query('COMMIT');

            const columns = pgResult.fields.map(f => f.name);
            const rows = pgResult.rows.map(row => columns.map(col => row[col]));

            res.json({
                result: {
                    columns,
                    rows,
                    rowCount: pgResult.rowCount,
                    executionTime: executionTime + 'ms'
                }
            });
        } catch (queryErr) {
            await client.query('ROLLBACK');
            res.status(400).json({
                error: `SQL Error: ${queryErr.message}`
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Execute error:', err);
        res.status(500).json({ error: 'Failed to execute query.' });
    }
});

module.exports = router;
