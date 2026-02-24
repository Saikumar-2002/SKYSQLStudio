const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '',
    database: process.env.PG_DATABASE || 'sql_sandbox',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 5000 // 5 second query timeout
});

const testPgConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('🐘 PostgreSQL connected successfully');
    } catch (err) {
        console.error('❌ PostgreSQL connection failed:', err.message);
        throw err;
    }
};

module.exports = { pool, testPgConnection };
