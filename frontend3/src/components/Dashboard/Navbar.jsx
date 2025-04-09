import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        {currentUser && (
          <>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Welcome, {currentUser.user.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Sign Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
