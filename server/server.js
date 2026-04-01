require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const { pool, initDatabase, toCamelCase, rowsToJson } = require('./models');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow Vercel URL or anyone in development
  credentials: true
}));
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'boom-industries', format: async (req, file) => 'jpg', public_id: (req, file) => file.fieldname + '-' + Date.now() }
});
const upload = multer({ storage: storage });

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const dec = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = dec.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== 'super') return res.status(403).json({ error: 'Access denied: Super Admins Only' });
  next();
};

// ================= ROUTES ================= //

// AUTH //
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const payload = { user: { id: admin.id, role: admin.role, username: admin.username } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// Create initial super admin on startup if none exists
async function initSuperAdmin() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(result.rows[0].count) === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password123', salt);
      await pool.query(
        'INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3)',
        ['superadmin', hash, 'super']
      );
      console.log('Default superadmin created: superadmin / password123');
    }
  } catch (err) {
    console.error('Error initializing super admin:', err);
  }
}

// PRODUCTS //
app.get('/api/products', async (req, res) => {
  try {
    let query = 'SELECT * FROM products';
    const params = [];
    if (req.query.category) {
      query += ' WHERE category = $1';
      params.push(req.query.category);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const image = req.file ? req.file.path : (req.body.image || null);
    const result = await pool.query(
      'INSERT INTO products (name, description, image, category, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description || null, image, category, price || null]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error('Product Add Error:', err?.message || err, err); res.status(500).send('Server Error'); }
});

app.put('/api/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, image = $3, category = $4, price = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, image, category, price, req.params.id]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Product removed' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// MEDIA //
app.get('/api/media', async (req, res) => {
  try {
    let query = 'SELECT * FROM media WHERE 1=1';
    const params = [];
    let paramCount = 0;
    if (req.query.category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(req.query.category);
    }
    if (req.query.type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(req.query.type);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/media', authMiddleware, multer().none(), async (req, res) => {
  try {
    const url = req.body.url || req.body.image;
    const { type, category, caption } = req.body;
    const result = await pool.query(
      'INSERT INTO media (url, type, category, caption) VALUES ($1, $2, $3, $4) RETURNING *',
      [url, type, category, caption]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/media/:id', authMiddleware, multer().none(), async (req, res) => {
  try {
    const url = req.body.url || req.body.image;
    const { type, category, caption } = req.body;
    const result = await pool.query(
      'UPDATE media SET url = $1, type = $2, category = $3, caption = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [url, type, category, caption, req.params.id]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.delete('/api/media/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Media removed' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// EVENTS //
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/events', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, date, location, status } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    const result = await pool.query(
      'INSERT INTO events (name, description, date, location, image, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, date || null, location, image, status || 'upcoming']
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/events/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, date, location, status } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    const result = await pool.query(
      'UPDATE events SET name = $1, description = $2, date = $3, location = $4, image = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, date || null, location, image, status, req.params.id]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Event removed' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// INQUIRIES //
app.get('/api/inquiries', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, phone, email, type, requirement, city, items, message, productName } = req.body;
    const result = await pool.query(
      'INSERT INTO inquiries (name, phone, email, type, requirement, city, items, message, product_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, phone, email, type, requirement, city, JSON.stringify(items || []), message, productName]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE inquiries SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [req.body.status, req.params.id]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.delete('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Inquiry removed' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// EVENT INQUIRIES //
app.get('/api/events/inquiries', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM event_inquiries ORDER BY created_at DESC');
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/events/inquiries', async (req, res) => {
  try {
    const { name, phone, email, eventType, date, location, budget, requirements } = req.body;
    const result = await pool.query(
      'INSERT INTO event_inquiries (name, phone, email, event_type, date, location, budget, requirements) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, phone, email, eventType, date, location, budget, requirements]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/events/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE event_inquiries SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [req.body.status, req.params.id]
    );
    res.json(toCamelCase(result.rows[0]));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// ADMINS //
app.get('/api/admins', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at, updated_at FROM admins');
    res.json(rowsToJson(result.rows));
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.post('/api/admins', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await pool.query('SELECT id FROM admins WHERE username = $1', [username]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Username already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await pool.query(
      'INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, role || 'regular']
    );
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/admins/:id/password', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'super') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await pool.query('UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hash, req.params.id]);
    res.json({ msg: 'Password updated' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/admins/:id/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'super') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const { username } = req.body;
    const existing = await pool.query('SELECT id FROM admins WHERE username = $1 AND id != $2', [username, req.params.id]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Username already taken' });
    
    await pool.query('UPDATE admins SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [username, req.params.id]);
    const updated = await pool.query('SELECT id, username, role FROM admins WHERE id = $1', [req.params.id]);
    
    // Create new token to reflect username change
    const payload = { user: updated.rows[0] };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    res.json({ user: payload.user, token });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.put('/api/admins/:id', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    const { username, role, password } = req.body;
    const existing = await pool.query('SELECT id FROM admins WHERE username = $1 AND id != $2', [username, req.params.id]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Username already taken' });
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await pool.query('UPDATE admins SET username = $1, role = $2, password_hash = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4', [username, role, hash, req.params.id]);
    } else {
      await pool.query('UPDATE admins SET username = $1, role = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [username, role, req.params.id]);
    }
    const updated = await pool.query('SELECT id, username, role FROM admins WHERE id = $1', [req.params.id]);
    res.json(updated.rows[0]);
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

app.delete('/api/admins/:id', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    await pool.query('DELETE FROM admins WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Admin removed' });
  } catch (err) { console.error(err); res.status(500).send('Server Error'); }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    // Check if the request is an API request
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// START
const PORT = process.env.PORT || 5000;


async function startServer() {
  try {
    await initDatabase();
    await initSuperAdmin();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
