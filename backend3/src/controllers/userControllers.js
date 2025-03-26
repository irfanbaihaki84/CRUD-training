const db = require('../config/db');

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

  // let newToday = `${dd}/${mm}/${yyyy}-${times}`;
  let newToday = `${today.toLocaleString()}`;
  console.log(newToday);
  return newToday;
};

// Create User
const createUser = (req, res) => {
  const {
    username,
    password,
    nama_lengkap,
    gender,
    nik,
    no_telepon,
    email,
    alamat,
    role,
    photo,
  } = req.body;
  const query = `INSERT INTO users (username, password, role, nama_lengkap, email, no_telepon, alamat, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [
      username,
      password,
      nama_lengkap,
      gender,
      nik,
      no_telepon,
      email,
      alamat,
      role,
      photo,
      getToday(),
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: 'User created successfully', id: result.insertId });
    }
  );
};

// Read All Users
const getUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Read One User
const getOneUser = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE id = ${id}`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Update User
const updateUser = (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    nama_lengkap,
    gender,
    nik,
    no_telepon,
    email,
    alamat,
    role,
    photo,
  } = req.body;
  const query = `UPDATE users SET username = ?, password = ?, nama_lengkap = ?, gender = ?, nik = ?, no_telepon = ?, email = ?, alamat = ?, role = ?, photo = ?, updated_at = ? WHERE id = ?`;
  db.query(
    query,
    [
      username,
      password,
      nama_lengkap,
      gender,
      nik,
      no_telepon,
      email,
      alamat,
      role,
      photo,
      getToday(),
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: 'User updated successfully', data: result });
    }
  );
};

const partialUpdateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const query = 'UPDATE users SET ? WHERE id = ?';
  db.query(query, [updates, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Pengiriman not found' });
    res.json({ message: 'Pengiriman partially updated successfully' });
  });
};

// Delete User
const deleteUser = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
};

module.exports = {
  createUser,
  getUsers,
  getOneUser,
  updateUser,
  partialUpdateUser,
  deleteUser,
};
