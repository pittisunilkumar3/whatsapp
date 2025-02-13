import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

function App() {
  const location = useLocation();
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isAuthPage = ['/login', '/register', '/superadmin/login'].includes(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);



  return (
    <div className="min-h-screen">
      {isAuthPage ? (
        <AppRoutes />
      ) : (
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      )}
    </div>
  );
}

export default App;
