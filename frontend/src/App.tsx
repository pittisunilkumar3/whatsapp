import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isAuthPage = ['/login', '/register', '/superadmin/login'].includes(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          theme: {
            primary: '#4aed88',
          },
        },
        error: {
          duration: 4000,
          theme: {
            primary: '#ff4b4b',
          },
        },
      }} />
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
