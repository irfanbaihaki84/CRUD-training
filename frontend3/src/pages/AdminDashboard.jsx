import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserTable from '../components/Dashboard/UserTable';
import UserModal from '../components/Dashboard/UserModal';
import { useAuth } from '../context/AuthContext';
// import { getUsers, deleteUser } from '../services/userService.jsx';
import userService from '../services/userService.jsx';
import Navbar from '../components/Dashboard/Navbar.jsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { authToken } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(authToken);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId, authToken);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
          setSelectedUser(null);
          setModalOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <UserTable
          users={users}
          onEdit={(user) => {
            setSelectedUser(user);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSave={fetchUsers}
      />
    </Box>
  );
};

export default AdminDashboard;
