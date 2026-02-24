const express = require('express');
const { getHint } = require('../services/llmService');
const router = express.Router();

// POST /api/hints
router.post('/', async (req, res) => {
    try {
        const { question, userQuery, schemaTables, difficulty } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Assignment question is required.' });
        }

        const hint = await getHint({
            question,
            userQuery: userQuery || '',
            schemaTables: schemaTables || [],
            difficulty: difficulty || 'Medium'
        });

        res.json({ hint });
    } catch (err) {
        console.error('Hint error:', err);
        res.status(500).json({
            error: 'Failed to generate hint.',
            hint: getFallbackHint(req.body.difficulty)
        });
    }
});

function getFallbackHint(difficulty) {
    const hints = {
        Easy: [
            'Start with the basic SELECT syntax: SELECT column1, column2 FROM table_name',
            'Remember: SELECT * means "all columns"',
            'The WHERE clause filters rows based on a condition'
        ],
        Medium: [
            'For JOINs, think about which column connects the two tables',
            'GROUP BY groups rows that share a value; aggregate functions (COUNT, AVG, SUM) work on each group',
            'HAVING is like WHERE, but it filters groups instead of individual rows'
        ],
        Hard: [
            'A subquery is a SELECT inside another SELECT — think of it as calculating a value first, then using it',
            'Window functions let you perform calculations across rows related to the current row',
            'RANK() OVER (PARTITION BY ... ORDER BY ...) ranks within each group'
        ]
    };
    const pool = hints[difficulty] || hints.Medium;
    return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = router;
