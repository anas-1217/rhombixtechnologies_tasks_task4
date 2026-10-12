const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const seedAdminAndPosts = require('./seed');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || 'Request failed' });
});

connectDB()
  .then(() => seedAdminAndPosts())
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
