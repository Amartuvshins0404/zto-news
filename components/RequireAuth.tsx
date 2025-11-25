
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';

interface RequireAuthProps {
  children: React.ReactElement;
  requiredRole?: string | string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
