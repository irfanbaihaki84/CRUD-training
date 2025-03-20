const db = require('../config/db');

// Create User
const createUser = (req, res) => {
  const { username, password, role, nama_lengkap, email, no_telepon, alamat } =
    req.body;
  const query =
    'INSERT INTO users (username, password, role, nama_lengkap, email, no_telepon, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(
    query,
    [username, password, role, nama_lengkap, email, no_telepon, alamat],
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
    res.json(results);
  });
};

// Update User
const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, password, role, nama_lengkap, email, no_telepon, alamat } =
    req.body;
  const query =
    'UPDATE users SET username = ?, password = ?, role = ?, nama_lengkap = ?, email = ?, no_telepon = ?, alamat = ? WHERE id = ?';
  db.query(
    query,
    [username, password, role, nama_lengkap, email, no_telepon, alamat, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated successfully' });
    }
  );
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

module.exports = { createUser, getUsers, updateUser, deleteUser };
