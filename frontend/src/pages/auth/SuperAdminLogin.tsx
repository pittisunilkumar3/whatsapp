import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, Wand2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Card } from '~/components/ui/Card';
import { useAuthStore } from '~/store/authStore';

export const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user, logout } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If already authenticated but not as superadmin, logout
    if (isAuthenticated && user?.role !== 'super_admin') {
      logout();
    }
    // If authenticated as superadmin, redirect to dashboard
    else if (isAuthenticated && user?.role === 'super_admin') {
      const from = location.state?.from?.pathname || '/superadmin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, logout, navigate, location]);

  const handleQuickFill = () => {
    setEmail('pittisunilkumar3@gmail.com');
    setPassword('Neelarani@10');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Submitting login form...');
      await login(email, password, 'super_admin');
      // Navigation will be handled by useEffect
    } catch (err) {
      console.error('Login error details:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed. Please check your credentials and try again.';
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[360px] sm:max-w-md mx-auto"
      >
      <Card className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Super Admin Access</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Secure administrative login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="relative">
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Admin Email
          </label>
          <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
          className="pr-10 w-full text-sm sm:text-base"
          />
          <button
          type="button"
          onClick={handleQuickFill}
          className="absolute right-2 top-[30px] sm:top-[34px] text-primary hover:bg-gray-100 p-1 rounded-full"
          title="Quick Fill Credentials"
          >
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Admin Password
          </label>
          <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
          className="w-full text-sm sm:text-base"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 sm:p-3 rounded-md">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full text-sm sm:text-base py-2 sm:py-2.5"
          disabled={isLoading}
        >
          {isLoading ? 'Authenticating...' : 'Secure Login'}
        </Button>

        <div className="text-center mt-2 sm:mt-4">
          <button 
          type="button"
          onClick={() => navigate('/login')}
          className="text-xs sm:text-sm text-primary hover:underline"
          >
          Back to Main Login
          </button>
        </div>
        </form>
      </Card>
      </motion.div>
    </div>
  );
};
