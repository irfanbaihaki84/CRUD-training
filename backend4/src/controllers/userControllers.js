const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { logAction } = require('../middleware/log');
const { getToday, validateInput } = require('../middleware/authenticate');

// Helper function to build WHERE clause
const buildWhereClause = (params) => {
  let whereClause = 'WHERE 1=1';
  const values = [];

  if (params.search) {
    whereClause += ` AND (username LIKE ? OR nama_lengkap LIKE ? OR email LIKE ?)`;
    values.push(
      `%${params.search}%`,
      `%${params.search}%`,
      `%${params.search}%`
    );
  }

  if (params.role) {
    whereClause += ` AND role = ?`;
    values.push(params.role);
  }

  if (params.is_active !== undefined) {
    whereClause += ` AND is_active = ?`;
    values.push(params.is_active === 'true' ? 1 : 0);
  }

  return { whereClause, values };
};

// Get all users with pagination, search, and filter
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 3, search, role, is_active } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const { whereClause, values } = buildWhereClause({
      search,
      role,
      is_active,
    });

    // Get total count
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      values
    );
    const total = countRows[0].total;

    // Get paginated data
    const [rows] = await pool.query(
      `SELECT 
        id, username, nama_lengkap, gender, nik, no_telepon, 
        email, alamat, role, photo, is_active, created_at, updated_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, parseInt(limit), parseInt(offset)]
    );

    const totalPages = Math.ceil(total / limit);

    // Log action
    await logAction(
      req.user.id,
      'read all users',
      'users',
      req.user.id,
      null,
      req
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// READ By ID - Admin atau user sendiri
exports.getUserById = async (req, res) => {
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

    // Log action
    await logAction(
      req.user.id,
      'read one user',
      'users',
      req.params.id,
      null,
      req
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/users (Admin only)
exports.createUserAdmin = async (req, res) => {
  try {
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
      is_active,
    } = req.body;

    // Validasi required fields
    if (!username || !password || !nama_lengkap || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check uniqueness
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query('INSERT INTO users SET ?', {
      username,
      password: hashedPassword,
      nama_lengkap,
      gender,
      nik,
      no_telepon,
      email,
      alamat,
      role,
      photo,
      is_active,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Log action
    await logAction(
      req.user.id,
      'create',
      'users',
      result.insertId,
      {
        newValue: req.body,
      },
      req
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// PATCH /api/users/adm/:id (Admin only)
exports.partialUpdateUserAdmin = async (req, res) => {
  // console.log(req.body);
  try {
    const { id } = req.params;
    const updateFields = req.body || {};

    // Validasi updateFields tidak kosong
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    // Validasi input
    const allowedFields = [
      'nama_lengkap',
      'gender',
      'nik',
      'no_telepon',
      'email',
      'alamat',
      'role',
      'photo',
      'is_active',
    ];

    // Filter field yang diizinkan
    const isValidUpdate = Object.keys(updateFields).every(
      (field) => !allowedFields.includes(field)
    );

    if (isValidUpdate.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${isValidUpdate.join(', ')}`,
        allowedFields,
      });
    }

    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Email uniqueness check
    if (updateFields.email && updateFields.email !== user[0].email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [updateFields.email, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Update user
    await pool.query('UPDATE users SET ? WHERE id = ?', [updateFields, id]);

    // Log action
    await logAction(
      req.user.id,
      'update',
      'users',
      id,
      {
        oldValue: user[0],
        newValue: { ...user[0], ...updateFields },
      },
      req
    );

    res.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// PATCH /api/users/profile (Karyawan/Pelanggan)
exports.partialUpdateUser = async (req, res) => {
  try {
    const { id } = req.user; // ID dari token
    const updateFields = req.body;

    // Validasi input
    const allowedFields = [
      'nama_lengkap',
      'gender',
      'nik',
      'no_telepon',
      'email',
      'alamat',
      'photo',
    ];

    const isValidUpdate = Object.keys(updateFields).every((field) =>
      allowedFields.includes(field)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid update fields',
      });
    }

    // Get current user data
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Email uniqueness check
    if (updateFields.email && updateFields.email !== user[0].email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [updateFields.email, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Update user
    await pool.query('UPDATE users SET ? WHERE id = ?', [updateFields, id]);

    // Log action
    await logAction(
      id,
      'update_profile',
      'users',
      id,
      {
        oldValue: user[0],
        newValue: { ...user[0], ...updateFields },
      },
      req
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// POST /api/users/register (Karyawan/Pelanggan)
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      nama_lengkap,
      gender,
      nik,
      no_telepon,
      email,
      alamat,
      photo,
    } = req.body;

    // Validasi required fields
    if (!username || !password || !nama_lengkap || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check uniqueness
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (default role pelanggan)
    const [result] = await pool.query('INSERT INTO users SET ?', {
      username,
      password: hashedPassword,
      nama_lengkap,
      gender,
      nik,
      no_telepon,
      email,
      alamat,
      role: 'pelanggan', // Default role
      photo,
      is_active: true, // Default active
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Log action
    await logAction(
      result.insertId,
      'register',
      'users',
      result.insertId,
      {
        newValue: req.body,
      },
      req
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.updatePassword = async (req, res) => {
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

    // Log action
    await logAction(
      req.user.id,
      'password update',
      'users',
      user.id,
      user.password,
      hashedPassword,
      req
    );

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
exports.deleteUser = async (req, res) => {
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
