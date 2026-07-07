import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { authService } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          
          Visitor Pre-Approval System
        </Typography>
        {currentUser && (
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccountCircle fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {currentUser.name || currentUser.email} ({currentUser.role?.replace('ROLE_', '')})
              </Typography>
            </Box>
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{ borderColor: 'rgba(255, 255, 255, 0.5)', '&:hover': { borderColor: '#fff' } }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;