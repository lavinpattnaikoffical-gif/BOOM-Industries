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

    // Seed default admin if none exists
    const adminCheck = await client.query('SELECT * FROM admins LIMIT 1');
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await require('bcryptjs').hash('admin123', 10);
      await client.query('INSERT INTO admins (username, password, role) VALUES ($1, $2, $3)', ['admin', hashedPassword, 'super']);
      console.log('Default admin seeded: admin / admin123');
    }

    // Seed initial products if none exist
    const productCheck = await client.query('SELECT * FROM products LIMIT 1');
    if (productCheck.rows.length === 0) {
      const initialProducts = [
        ['Pro Rockets', '₹450', 'Rockets', 'High altitude sky rockets with gold glitter trails.', 'https://images.unsplash.com/photo-1533230408703-a2321476c827?auto=format&fit=crop&q=80', '4.8'],
        ['Gold Sparklers', '₹150', 'Sparklers', 'Classic long-burning golden sparklers.', 'https://images.unsplash.com/photo-1467810563316-b54765359382?auto=format&fit=crop&q=80', '4.5'],
        ['Silver Fountain', '₹280', 'Fountains', 'High-intensity silver fountain with purple stars.', 'https://images.unsplash.com/photo-1533230119143-d10ee7b00951?auto=format&fit=crop&q=80', '4.7'],
        ['Heavy Crackers', '₹350', 'Crackers', 'Loud banging crackers for festive celebrations.', 'https://images.unsplash.com/photo-1507119141445-565492d6e6ab?auto=format&fit=crop&q=80', '4.4'],
        ['Fancy Aerial', '₹1200', 'Rockets', 'Multicolor aerial shells with massive break.', 'https://images.unsplash.com/photo-1498910145784-efc7188f6140?auto=format&fit=crop&q=80', '4.9'],
        ['Flower Pot', '₹200', 'Fountains', 'Smooth golden sparks for children safety.', 'https://images.unsplash.com/photo-1545199698-10659be83be2?auto=format&fit=crop&q=80', '4.6']
      ];
      for (const p of initialProducts) {
        await client.query('INSERT INTO products (name, price, category, description, image, rating) VALUES ($1, $2, $3, $4, $5, $6)', p);
      }
      console.log('Default products seeded');
    }

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
