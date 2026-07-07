import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: [ROLES.EMPLOYEE, ROLES.SECURITY] },
    { text: 'Register Visitor', icon: <PersonAddIcon />, path: '/register-visitor', roles: [ROLES.EMPLOYEE] },
    { text: 'My Visitors', icon: <PeopleIcon />, path: '/my-visitors', roles: [ROLES.EMPLOYEE] },
    { text: 'Security Panel', icon: <SecurityIcon />, path: '/security-dashboard', roles: [ROLES.SECURITY] },
    { text: 'Reports & Stats', icon: <BarChartIcon />, path: '/reports', roles: [ ROLES.SECURITY] },
  ];

  // Robust prefix-agnostic matching algorithm to align "EMPLOYEE" and "ROLE_EMPLOYEE"
  const filteredItems = menuItems.filter(item => {
    if (!item.roles) return true;
    if (!userRole) return false;

    return item.roles.some(role => {
      const cleanAllowedRole = role.replace('ROLE_', '');
      const cleanUserRole = userRole.replace('ROLE_', '');
      return cleanAllowedRole === cleanUserRole;
    });
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {filteredItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                      '&:hover': { backgroundColor: 'primary.main' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? 'primary.contrastText' : 'text.secondary', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'body2', fontWeight: isSelected ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
          
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;