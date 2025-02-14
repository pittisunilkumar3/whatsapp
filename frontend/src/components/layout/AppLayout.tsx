import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AccessibilityProvider } from '../ui/AccessibilityProvider';
import { SkipNavigation, MainContentMarkers } from '../ui/SkipNavigation';

interface AppLayoutProps {

  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const isAuthPage = ['/login', '/register', '/superadmin/login'].includes(location.pathname);

  // Determine appropriate login route based on current path
  const getLoginRoute = () => {
    if (location.pathname.startsWith('/superadmin')) {
      return '/superadmin/login';
    }
    return '/login';
  };

  // Redirect to appropriate login page if not authenticated
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to={getLoginRoute()} state={{ from: location }} replace />;
  }

  // Don't wrap auth pages in layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For authenticated users, verify role matches the route
  if (isAuthenticated && user) {
    const isSuperAdminRoute = location.pathname.startsWith('/superadmin');
    const isCompanyAdminRoute = location.pathname.startsWith('/company-admin');
    const isEmployeeRoute = location.pathname.startsWith('/employee');

    if (isSuperAdminRoute && user.role !== 'super_admin') {
      return <Navigate to="/unauthorized" replace />;
    }

    if (isCompanyAdminRoute && user.role !== 'company_admin') {
      return <Navigate to="/unauthorized" replace />;
    }

    if (isEmployeeRoute && user.role !== 'employee') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <AccessibilityProvider>
        <div className="min-h-screen bg-gray-100 relative">
        <SkipNavigation />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
            <div className="flex-1 flex flex-col w-full relative">
            <Navbar />
            <main 
              id="main-content"
              className="flex-1 overflow-auto bg-gray-100 px-3 py-4 sm:p-6"
              role="main"
              aria-label="Main content"
            >
              <MainContentMarkers />
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        </div>
      </AccessibilityProvider>
      );
    };
