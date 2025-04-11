const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logAction } = require('../middleware/log');

// Sign Up
exports.signup = async (req, res) => {
  try {
    const { username, password, nama_lengkap, email } = req.body;

    // Check if user exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query('INSERT INTO users SET ?', {
      username,
      password: hashedPassword,
      nama_lengkap,
      email,
    });

    // Log action
    await logAction(
      result.insertId,
      'create',
      'users',
      result.insertId,
      null,
      req
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Sign In
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Log action
    await logAction(user.id, 'login', 'users', user.id, null, req);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '300000',
    });

    const resetTokenExpires = new Date(Date.now() + 420000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetTokenExpires, user.id]
    );

    // Log action
    await logAction(user.id, 'forgot_password', 'users', user.id, null, req);

    // In a real app, you would send an email here
    res.json({
      message: 'Reset token generated',
      token: resetToken, // Normally you wouldn't return this
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
