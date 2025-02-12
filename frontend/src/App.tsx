import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/superadmin/login'].includes(location.pathname);

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
