/**
 * Seed PostgreSQL with schemas and sample data for assignments.
 * Run: node seeds/seedPostgres.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '',
    database: process.env.PG_DATABASE || 'sql_sandbox'
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Seeding PostgreSQL...');

        // --- Schema: assignment_1 (employees flat table) ---
        await client.query('DROP SCHEMA IF EXISTS assignment_1 CASCADE');
        await client.query('CREATE SCHEMA assignment_1');
        await client.query(`
      CREATE TABLE assignment_1.employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        department VARCHAR(50),
        salary DECIMAL(10,2),
        hire_date DATE
      )
    `);
        await client.query(`
      INSERT INTO assignment_1.employees (first_name, last_name, email, department, salary, hire_date) VALUES
      ('Alice', 'Johnson', 'alice@company.com', 'Engineering', 85000, '2021-03-15'),
      ('Bob', 'Smith', 'bob@company.com', 'Marketing', 65000, '2020-07-01'),
      ('Carol', 'Williams', 'carol@company.com', 'Engineering', 92000, '2019-11-20'),
      ('David', 'Brown', 'david@company.com', 'Sales', 58000, '2022-01-10'),
      ('Eva', 'Davis', 'eva@company.com', 'Engineering', 78000, '2021-06-25'),
      ('Frank', 'Miller', 'frank@company.com', 'Marketing', 62000, '2020-09-14'),
      ('Grace', 'Wilson', 'grace@company.com', 'Sales', 71000, '2019-04-30'),
      ('Henry', 'Moore', 'henry@company.com', 'Engineering', 95000, '2018-12-01')
    `);
        console.log('  ✅ Schema assignment_1 created');

        // --- Schema: assignment_2 (employees + departments for JOINs) ---
        await client.query('DROP SCHEMA IF EXISTS assignment_2 CASCADE');
        await client.query('CREATE SCHEMA assignment_2');
        await client.query(`
      CREATE TABLE assignment_2.departments (
        id SERIAL PRIMARY KEY,
        department_name VARCHAR(50),
        location VARCHAR(100)
      )
    `);
        await client.query(`
      INSERT INTO assignment_2.departments (department_name, location) VALUES
      ('Engineering', 'Building A'),
      ('Marketing', 'Building B'),
      ('Sales', 'Building C'),
      ('HR', 'Building A')
    `);
        await client.query(`
      CREATE TABLE assignment_2.employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        department_id INTEGER REFERENCES assignment_2.departments(id),
        salary DECIMAL(10,2)
      )
    `);
        await client.query(`
      INSERT INTO assignment_2.employees (first_name, last_name, department_id, salary) VALUES
      ('Alice', 'Johnson', 1, 85000),
      ('Bob', 'Smith', 2, 65000),
      ('Carol', 'Williams', 1, 92000),
      ('David', 'Brown', 3, 58000),
      ('Eva', 'Davis', 1, 78000)
    `);
        console.log('  ✅ Schema assignment_2 created');

        console.log('🎉 PostgreSQL seeding complete!');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
