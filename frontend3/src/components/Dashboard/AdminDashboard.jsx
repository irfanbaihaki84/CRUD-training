import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Navbar from './Navbar';

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Welcome to the administration panel. Here you can manage users,
            content, and settings.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
