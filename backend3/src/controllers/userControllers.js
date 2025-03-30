const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { getToday } = require('../middleware/authenticate');
const { validateInput } = require('../middleware/authenticate');

// CREATE - Admin only
const createUser = async (req, res) => {
  const {
    username,
    password,
    nama_lengkap,
    email,
    role = 'pelanggan',
  } = req.body;

  try {
    const [result] = await pool.query(`INSERT INTO users SET ?`, {
      username,
      password,
      nama_lengkap,
      email,
      role,
      is_active: 1,
      created_at: getToday,
      updated_at: getToday,
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Create user failed' });
  }
};

// READ All - Admin only
const getAllUsers = async (req, res) => {
  try {
    let query =
      'SELECT id, username, nama_lengkap, email, role FROM users WHERE is_active = 1';

    // Jika bukan admin, hanya tampilkan data sendiri
    if (req.user.role !== 'admin') {
      query += ' AND id = ?';
      const [rows] = await pool.query(query, [req.user.id]);
      return res.json(rows);
    }

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ By ID - Admin atau user sendiri
const getUserById = async (req, res) => {
  try {
    let query =
      'SELECT id, username, nama_lengkap, email, role FROM users WHERE id = ? AND is_active = 1';

    // Jika bukan admin dan mencoba akses user lain
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const [rows] = await pool.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Admin atau user sendiri
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const allowedFields = [
    'nama_lengkap',
    'email',
    'no_telepon',
    'alamat',
    'photo',
  ];

  try {
    // Jika bukan admin dan mencoba update user lain
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Filter field yang diizinkan
    const validUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    if (Object.keys(validUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Tambahkan updated_at
    validUpdates.updated_at = getToday();

    const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [
      validUpdates,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      updatedFields: validUpdates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Validasi input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Current password and new password are required',
    });
  }

  try {
    // 1. Validasi karakter berbahaya
    validateInput(newPassword);

    // 2. Dapatkan data user
    const [users] = await pool.query(
      'SELECT id, password, role FROM users WHERE id = ? AND is_active = 1',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // 3. Verifikasi akses
    // - Admin bisa update password siapa saja
    // - User hanya bisa update password sendiri
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: 'You can only update your own password',
      });
    }

    // 4. Verifikasi password lama (kecuali admin)
    if (req.user.role !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    // 5. Validasi password baru
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: 'New password must be different from current password',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      });
    }

    // 6. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. Update database
    await pool.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, id]
    );

    // 8. Log activity (opsional)
    // await pool.query('INSERT INTO audit_logs SET ?', {
    //   user_id: req.user.id,
    //   action: 'password_update',
    //   target_user: id,
    //   created_at: getToday,
    // });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);

    if (err.message.includes('invalid characters')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Password update failed' });
  }
};

// DELETE - Admin only
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
};
