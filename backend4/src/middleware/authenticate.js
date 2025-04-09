const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query(
      'SELECT id, username, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.authorize = (req, res, next) => {
  console.log('authorize ', req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      message: `User role ${req.user.role} is not authorized to access this route`,
    });
  }
};

exports.getToday = () => {
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

exports.validateInput = (input) => {
  const forbiddenChars = /[\'"`|=+\/\\[\]{}()%$!&#*]/;
  if (forbiddenChars.test(input)) {
    throw new Error('Input contains invalid characters');
  }
};
