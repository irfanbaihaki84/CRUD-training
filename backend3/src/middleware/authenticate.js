const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Fungsi generate token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

// Middleware autentikasi
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token)
      return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (!user.length) return res.status(401).json({ error: 'User not found' });

    req.user = user[0];
    next();
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'Token expired. Please login again.' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware authorization
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
  };
};

const getToday = () => {
  const today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  let timeFormat = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  console.log(timeFormat.format(today));

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  // contoh1:
  // let newToday = `${dd}/${mm}/${yyyy}-${times}`;

  // contoh2:
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(currentTime);

  let newToday = `${today.toLocaleString()}`;
  // contoh3:
  console.log(newToday);
  return newToday;
};

const validateInput = (input) => {
  const forbiddenChars = /[\'"`|=+\/\\[\]{}()%$!&#*]/;
  if (forbiddenChars.test(input)) {
    throw new Error('Input contains invalid characters');
  }
};

module.exports = {
  generateToken,
  authenticate,
  authorize,
  getToday,
  validateInput,
};
