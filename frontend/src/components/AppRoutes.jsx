import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RegisterVisitor from '../pages/RegisterVisitor';
import MyVisitors from '../pages/MyVisitors';
import SecurityDashboard from '../pages/SecurityDashboard';
import Reports from '../pages/Reports';
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const Layout = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Layout><Login /></Layout>} />
      
      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.SECURITY, ROLES.ADMIN]}>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />

      <Route path="/register-visitor" element={
        <PrivateRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
          <Layout><RegisterVisitor /></Layout>
        </PrivateRoute>
      } />

      <Route path="/my-visitors" element={
        <PrivateRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
          <Layout><MyVisitors /></Layout>
        </PrivateRoute>
      } />

      <Route path="/security-dashboard" element={
        <PrivateRoute allowedRoles={[ROLES.SECURITY, ROLES.ADMIN]}>
          <Layout><SecurityDashboard /></Layout>
        </PrivateRoute>
      } />

      <Route path="/reports" element={
        <PrivateRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.SECURITY, ROLES.ADMIN]}>
          <Layout><Reports /></Layout>
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;