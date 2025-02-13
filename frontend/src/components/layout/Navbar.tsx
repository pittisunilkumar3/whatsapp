import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const getSettingsPath = () => {
    switch (user?.role) {
      case 'super_admin':
        return '/superadmin/settings';
      case 'company_admin':
        return '/settings';
      case 'employee':
        return '/employee/settings';
      default:
        return '/settings';
    }
  };

  const getProfilePath = () => {
    switch (user?.role) {
      case 'super_admin':
        return '/superadmin/profile';
      case 'company_admin':
        return '/company-admin/profile';
      case 'employee':
        return '/employee/profile';
      default:
        return '/login';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center px-3 sm:px-6">
      <div className="flex-1">
      <span className="text-base sm:text-lg font-medium text-gray-700 truncate">
        Welcome, {user?.name}
      </span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
      <button 
        className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
        onClick={() => navigate(getSettingsPath())}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative" ref={userMenuRef}>
        <button 
        className="flex items-center space-x-1 sm:space-x-2 p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
        onClick={() => setShowUserMenu(!showUserMenu)}
        aria-label="User menu"
        >
        <User className="w-5 h-5 text-gray-600" />
        <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
        </button>
        
        {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
          <p className="font-semibold text-sm sm:text-base truncate">{user?.name}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email}</p>
          </div>
          <button 
          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center touch-manipulation"
            onClick={() => navigate(getProfilePath())}
          >
          <User className="w-4 h-4 mr-2" />
          Profile
          </button>
          <button 
          className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center touch-manipulation"
          onClick={handleLogout}
          >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
          </button>
        </div>
        )}
      </div>
      </div>
    </nav>
  );
};