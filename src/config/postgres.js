const { Pool } = require('pg');

// create a pool of connections to postgres
const db = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// test the connection on startup
const connectPostgres = async () => {
  try {
    const client = await db.connect();
    console.log('✅ PostgreSQL connected');
    client.release();

    // create users table if it doesn't exist yet
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Users table ready');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { db, connectPostgres };
