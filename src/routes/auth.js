const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../utils/db');
const requireAuth = require('../middleware/requireAuth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash, role, status: 'pending' });
    res.json({ message: 'Signup request sent. Await admin approval.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.status !== 'active') return res.status(403).json({ message: 'User not active' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', requireAuth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: get pending users
router.get('/pending-users', requireAuth(['Admin']), async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: approve users & assign roles
router.post('/approve', requireAuth(['Admin']), async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updates = { status: 'active' };
    if (role) updates.role = role;
    
    await User.updateById(userId, updates);
    res.json({ message: 'User approved/role updated.' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: get all users
router.get('/users', requireAuth(['Admin']), async (req, res) => {
  try {
    const users = await User.find({});
    // Remove password from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
