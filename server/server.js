require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Product, Inquiry, EventInquiry, Media, Admin } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boom-industries', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

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
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const payload = { user: { id: admin.id, role: admin.role, username: admin.username } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: payload.user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// Create initial super admin on startup if none exists
async function initSuperAdmin() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    await Admin.create({ username: 'superadmin', passwordHash: hash, role: 'super' });
    console.log('Default superadmin created: superadmin / password123');
  }
}
initSuperAdmin();

// PRODUCTS //
app.get('/api/products', async (req, res) => {
  try {
    const qs = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(qs).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// MEDIA //
app.get('/api/media', async (req, res) => {
  try {
    const query = req.query.category ? { category: req.query.category } : {};
    if (req.query.type) query.type = req.query.type;
    const allMedia = await Media.find(query).sort({ createdAt: -1 });
    res.json(allMedia);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/media', authMiddleware, multer().none(), async (req, res) => {
  try {
    const url = req.body.url || req.body.image;
    const media = new Media({ ...req.body, url });
    await media.save();
    res.json(media);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/media/:id', authMiddleware, multer().none(), async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.image) update.url = update.image;
    const updated = await Media.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/media/:id', authMiddleware, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Media removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// INQUIRIES //
app.get('/api/inquiries', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const info = new Inquiry(req.body);
    await info.save();
    res.json(info);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).send('Server Error'); }
});

// EVENT INQUIRIES //
app.get('/api/events/inquiries', authMiddleware, async (req, res) => {
  try {
    const events = await EventInquiry.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/events/inquiries', async (req, res) => {
  try {
    const ev = new EventInquiry(req.body);
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/events/inquiries/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await EventInquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ADMINS //
app.get('/api/admins', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    const admins = await Admin.find().select('-passwordHash');
    res.json(admins);
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/admins', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let admin = await Admin.findOne({ username });
    if (admin) return res.status(400).json({ error: 'Username already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    admin = new Admin({ username, passwordHash: hash, role: role || 'regular' });
    await admin.save();
    res.json({ id: admin._id, username: admin.username, role: admin.role });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/admins/:id/password', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'super') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await Admin.findByIdAndUpdate(req.params.id, { passwordHash: hash });
    res.json({ msg: 'Password updated' });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/admins/:id', [authMiddleware, superAdminMiddleware], async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Admin removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
