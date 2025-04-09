import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';

const UserModal = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'pelanggan',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        password: '',
      });
    } else {
      setFormData({
        username: '',
        email: '',
        role: 'pelanggan',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      // Implementasi API call untuk save user
      await onSave();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          margin="normal"
          fullWidth
          label="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          disabled={!!user}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            label="Role"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="karyawan">Karyawan</MenuItem>
            <MenuItem value="pelanggan">Pelanggan</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          fullWidth
          label={user ? 'New Password (leave blank to keep)' : 'Password'}
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
