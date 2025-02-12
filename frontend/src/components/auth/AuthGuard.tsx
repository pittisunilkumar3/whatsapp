import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AuthGuard: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to appropriate login
  if (!isAuthenticated) {
    const loginRoute = location.pathname.startsWith('/superadmin') 
      ? '/superadmin/login' 
      : '/login';
    return <Navigate to={loginRoute} state={{ from: location }} replace />;
  }

  return <Outlet />;
};