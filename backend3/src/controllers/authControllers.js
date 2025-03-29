const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken, getToday } = require('../middleware/authenticate');

// Validasi input
const validateInput = (input) => {
  const forbiddenChars = /[\'"`|=+\/\\[\]{}()%$!&#*]/;
  if (forbiddenChars.test(input)) {
    throw new Error('Input contains forbidden characters');
  }
};

// Signup
const signup = async (req, res) => {
  const {
    username,
    password,
    nama_lengkap,
    email,
    role = 'pelanggan',
  } = req.body;

  try {
    validateInput(username);
    validateInput(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`INSERT INTO users SET ?`, {
      username,
      password: hashedPassword,
      nama_lengkap,
      email,
      role,
      is_active: 1,
      created_at: getToday,
      updated_at: getToday,
    });

    const token = generateToken(result.insertId, role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        nama_lengkap,
        email,
        role,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Signin
const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!users.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Signout
const signout = (req, res) => {
  res.json({
    message: 'Logout successful. Please remove the token from client storage.',
    action: 'Delete the token from localStorage/sessionStorage/cookies',
  });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { id: users[0].id },
      process.env.JWT_SECRET + '_RESET',
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // Contoh: sendResetEmail(email, resetToken);

    res.json({
      message: 'Password reset link sent to email',
      resetToken, // Hanya untuk testing, di production jangan dikirim
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  forgotPassword,
};
