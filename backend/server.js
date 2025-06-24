const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'neethu@1005',
  database: process.env.DB_NAME || 'tile_gallery_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to restrict to admin role
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secure-secret-key',
        { expiresIn: '1h' }
      );
      res.json({ token });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET Endpoints (accessible to both admin and viewer)
app.get('/api/categories', verifyToken, (req, res) => {
  db.query('SELECT category_id, name FROM category_master', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    console.log('Fetched categories:', results);
    res.json(results);
  });
});

app.get('/api/applications', verifyToken, (req, res) => {
  db.query('SELECT application_id, name FROM application_master', (err, results) => {
    if (err) {
      console.error('Error fetching applications:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    console.log('Fetched applications:', results);
    res.json(results);
  });
});

app.get('/api/products', verifyToken, (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
    res.json(results);
  });
});

// POST Endpoint (Create - Admin only)
app.post('/api/products', verifyToken, restrictToAdmin, (req, res) => {
  const { prod_name, sqcode, category_id, application_id, block } = req.body;
  console.log('Received POST data:', req.body);
  const errors = [];
  if (!prod_name || typeof prod_name !== 'string' || prod_name.trim() === '') {
    errors.push('Product name is required and must be a non-empty string');
  }
  if (!sqcode || typeof sqcode !== 'string' || sqcode.trim() === '') {
    errors.push('SQ code is required and must be a non-empty string');
  }
  if (!category_id || isNaN(parseInt(category_id))) {
    errors.push('Category ID is required and must be a valid number');
  }
  if (!application_id || isNaN(parseInt(application_id))) {
    errors.push('Application ID is required and must be a valid number');
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Missing or invalid required fields', errors });
  }
  const query = 'INSERT INTO products (prod_name, sqcode, category_id, application_id, block) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [prod_name, sqcode, parseInt(category_id), parseInt(application_id), block || 'A'], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ message: 'Error creating product', error: err.message });
    }
    db.query('SELECT * FROM products WHERE prod_id = ?', [result.insertId], (err, rows) => {
      if (err) {
        console.error('Error fetching created product:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json(rows[0]);
    });
  });
});

// PUT Endpoint (Update - Admin only)
app.put('/api/products/:prod_id', verifyToken, restrictToAdmin, (req, res) => {
  const { prod_id } = req.params;
  const { prod_name, sqcode, category_id, application_id, block } = req.body;
  console.log('Received PUT data:', req.body);
  const errors = [];
  if (!prod_name || typeof prod_name !== 'string' || prod_name.trim() === '') {
    errors.push('Product name is required and must be a non-empty string');
  }
  if (!sqcode || typeof sqcode !== 'string' || sqcode.trim() === '') {
    errors.push('SQ code is required and must be a non-empty string');
  }
  if (!category_id || isNaN(parseInt(category_id))) {
    errors.push('Category ID is required and must be a valid number');
  }
  if (!application_id || isNaN(parseInt(application_id))) {
    errors.push('Application ID is required and must be a valid number');
  }
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Missing or invalid required fields', errors });
  }
  const query = 'UPDATE products SET prod_name = ?, sqcode = ?, category_id = ?, application_id = ?, block = ? WHERE prod_id = ?';
  db.query(query, [prod_name, sqcode, parseInt(category_id), parseInt(application_id), block || 'A', prod_id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    db.query('SELECT * FROM products WHERE prod_id = ?', [prod_id], (err, rows) => {
      if (err) {
        console.error('Error fetching updated product:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(rows[0]);
    });
  });
});

// DELETE Endpoint (Delete - Admin only)
app.delete('/api/products/:prod_id', verifyToken, restrictToAdmin, (req, res) => {
  const { prod_id } = req.params;
  const query = 'DELETE FROM products WHERE prod_id = ?';
  db.query(query, [prod_id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));