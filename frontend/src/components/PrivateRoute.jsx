import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser?.role; // e.g., "SECURITY"
    
    // Normalize checks to match either clean "SECURITY" or prefixed "ROLE_SECURITY"
    const hasAccess = allowedRoles.some(role => {
      if (!userRole) return false;
      
      const cleanRole = role.replace('ROLE_', '');
      const cleanUserRole = userRole.replace('ROLE_', '');
      
      return cleanRole === cleanUserRole;
    });

    if (!hasAccess) {
      console.warn(`Access denied for role: ${userRole}. Allowed roles:`, allowedRoles);
      
      // If the user is a SECURITY guard, redirect them safely to their dedicated viewport instead of a loop
      if (userRole === 'SECURITY' || userRole === 'ROLE_SECURITY') {
        return <Navigate to="/security-dashboard" replace />;
      }
      
      // Fallback baseline for standard users
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;