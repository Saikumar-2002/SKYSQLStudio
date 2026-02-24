/**
 * SQL Query Validator & Sanitizer
 * Blocks dangerous SQL operations — only SELECT queries allowed.
 */

const BLOCKED_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE',
    'TRUNCATE', 'GRANT', 'REVOKE', 'COPY', 'EXECUTE', 'EXEC',
    'INTO', 'SET', 'REPLACE', 'MERGE', 'CALL', 'DO',
    'LOCK', 'UNLOCK', 'RENAME', 'COMMENT', 'VACUUM', 'REINDEX',
    'CLUSTER', 'DISCARD', 'PREPARE', 'DEALLOCATE', 'LISTEN',
    'NOTIFY', 'LOAD', 'SECURITY', 'OWNER'
];

const BLOCKED_PATTERNS = [
    /;\s*\S/i,                    // Multiple statements (semicolon followed by text)
    /--/,                          // SQL comments
    /\/\*/,                        // Block comments
    /\\copy/i,                     // psql copy command
    /pg_sleep/i,                   // Sleep attacks
    /pg_read_file/i,               // File read attacks
    /pg_write_file/i,              // File write attacks
    /information_schema\./i,       // Schema introspection (optional: remove if you want to allow)
    /pg_catalog\./i,               // System catalog access
];

function validateSQL(req, res, next) {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required and must be a string.' });
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
        return res.status(400).json({ error: 'Query cannot be empty.' });
    }

    if (trimmedQuery.length > 5000) {
        return res.status(400).json({ error: 'Query too long. Maximum 5000 characters.' });
    }

    // Normalize: remove string literals to avoid false positives
    const normalized = trimmedQuery
        .replace(/'[^']*'/g, "''")   // Remove string contents
        .toUpperCase();

    // Check that query starts with SELECT or WITH (for CTEs)
    if (!normalized.match(/^\s*(SELECT|WITH)\b/i)) {
        return res.status(403).json({
            error: 'Only SELECT queries are allowed. Your query must start with SELECT or WITH.'
        });
    }

    // Check for blocked keywords
    for (const keyword of BLOCKED_KEYWORDS) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(normalized)) {
            return res.status(403).json({
                error: `Forbidden operation detected: "${keyword}". Only SELECT queries are permitted.`
            });
        }
    }

    // Check for blocked patterns
    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(trimmedQuery)) {
            return res.status(403).json({
                error: 'Query contains forbidden patterns. Please use only simple SELECT queries.'
            });
        }
    }

    // Sanitize: trim and remove trailing semicolons
    req.body.query = trimmedQuery.replace(/;\s*$/, '');
    next();
}

module.exports = validateSQL;
