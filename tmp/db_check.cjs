const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });
const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

async function check() {
  try {
    const i = await pool.query('SELECT COUNT(*) FROM inquiries');
    const e = await pool.query('SELECT COUNT(*) FROM event_inquiries');
    const last = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 1');
    const lastEvent = await pool.query('SELECT * FROM event_inquiries ORDER BY created_at DESC LIMIT 1');
    
    console.log('--- DATABASE STATUS ---');
    console.log(`Standard Inquiries: ${i.rows[0].count}`);
    console.log(`Event Inquiries: ${e.rows[0].count}`);
    if (last.rows[0]) console.log('Last Standard:', last.rows[0].name, '-', last.rows[0].requirement);
    if (lastEvent.rows[0]) console.log('Last Event:', lastEvent.rows[0].name, '-', lastEvent.rows[0].event_type);
  } catch (err) {
    console.error('Check failed:', err.message);
  } finally {
    await pool.end();
  }
}
check();
