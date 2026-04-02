const { Pool } = require('pg');

// PostgreSQL connection pool (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'regular' CHECK (role IN ('super', 'regular')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        category VARCHAR(100) NOT NULL,
        price VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'video')),
        category VARCHAR(50) CHECK (category IN ('Photos', 'Videos', 'Events')),
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        type VARCHAR(100),
        requirement TEXT,
        city VARCHAR(100),
        items JSONB DEFAULT '[]',
        message TEXT,
        product_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS event_inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        event_type VARCHAR(50) CHECK (event_type IN ('Wedding', 'Festival', 'Corporate', 'Birthday', 'Other')),
        date DATE,
        location VARCHAR(255),
        budget VARCHAR(100),
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE,
        location VARCHAR(255),
        image VARCHAR(500),
        status VARCHAR(50) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
    `);
    console.log('Database tables initialized');
  } finally {
    client.release();
  }
}

// Helper to convert snake_case to camelCase
function toCamelCase(row) {
  if (!row) return null;
  const result = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = row[key];
  }
  return result;
}

function rowsToJson(rows) {
  return rows.map(toCamelCase);
}

module.exports = { pool, initDatabase, toCamelCase, rowsToJson };
