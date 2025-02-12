import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Cog } from 'lucide-react';

import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Card } from '~/components/ui/Card';
import { useAuthStore } from '~/store/authStore';


export const Login: React.FC = () => {
  const { login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'company_admin' | 'employee' | null>(null);

  const handleRoleSelect = (role: 'company_admin' | 'employee') => {
    console.log('Selected role:', role);
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (selectedRole === 'employee' && !username.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await login(username, password, selectedRole);
      console.log('Login successful for role:', selectedRole);
    } catch (err) {
      console.error('Login failed:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6 sm:p-4">
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[360px] sm:max-w-md"
      >
      <Card className="p-4 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-3 sm:mb-4">
          <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Sign in to access your account</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <button
            onClick={() => handleRoleSelect('company_admin')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform ${
            selectedRole === 'company_admin'
            ? 'border-primary bg-primary/20 scale-105 shadow-lg ring-2 ring-primary/30'
            : 'border-gray-200 hover:border-primary/50 hover:scale-102 hover:bg-gray-50'
            }`}
            >
            <Cog className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
            <span className="block text-xs sm:text-sm font-medium">Company Admin</span>
            </button>
            <button
            onClick={() => handleRoleSelect('employee')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform ${
            selectedRole === 'employee'
            ? 'border-primary bg-primary/20 scale-105 shadow-lg ring-2 ring-primary/30'
            : 'border-gray-200 hover:border-primary/50 hover:scale-102 hover:bg-gray-50'
            }`}
            >
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
          <span className="block text-xs sm:text-sm font-medium">Employee</span>
          </button>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
          <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {selectedRole === 'company_admin' ? 'Username' : 'Email'}
          </label>
          <Input
            id="username"
            type={selectedRole === 'company_admin' ? 'text' : 'email'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={selectedRole === 'company_admin' ? 'Enter username' : 'Enter email'}

            required
            className="text-sm sm:text-base"
          />
          </div>

          <div>
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="text-sm sm:text-base"

          />
          </div>

          {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-md">
            {error}
          </div>
          )}

          <Button
          type="submit"
          className="w-full text-sm sm:text-base py-2 sm:py-2.5"
          disabled={isLoading}
          >
          {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        </Card>
      </motion.div>
    </div>
  );
};