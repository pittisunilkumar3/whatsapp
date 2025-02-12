import { create } from 'zustand';
import { apiService } from '~/services/api';

interface User {
  id: number;
  email: string;
  role: 'super_admin' | 'company_admin' | 'employee';
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  country_code: string;
  is_active: number;
  last_login: string;
  created_at: string;
  updated_at: string;
  // Add company fields for company_admin role
  company?: {
    id: number;
    username: string;
    company_name: string;
    trading_name: string;
    industry: string;
    email: string;
    phone: string;
    website: string;
    company_type: string;
    registration_number: string;
    tax_number: string;
    founded_date: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    contact_person_position: string;
    contact_person_mobile: string;
    street_address: string;
    building_name: string;
    floor_number: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    status: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, requiredRole?: 'super_admin' | 'company_admin' | 'employee') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}


// Mock users for development
const mockUsers = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'admin123',
    role: 'company_admin' as const,
    first_name: 'Admin',
    last_name: 'User',
    username: 'admin',
    phone_number: '+1234567890',
    country_code: 'US',
    is_active: 1,
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'employee@test.com',
    password: 'employee123',
    role: 'employee' as const,
    first_name: 'Employee',
    last_name: 'User',
    username: 'employee',
    phone_number: '+1234567891',
    country_code: 'US',
    is_active: 1,
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useAuthStore = create<AuthState>((set) => {
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({ user: parsedUser, isAuthenticated: true });
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      }
    }
  };

  initializeAuth();

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,

    checkAuth: () => {
      initializeAuth();
    },

    login: async (username: string, password: string, requiredRole?: 'super_admin' | 'company_admin' | 'employee') => {
      set({ isLoading: true });
      try {
      if (requiredRole === 'super_admin') {
        const response = await apiService.superAdminLogin(username, password);
        if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
        }
        const userData = {
        ...response.data,
        role: 'super_admin' as const
        };
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
      } else if (requiredRole === 'company_admin') {
        const response = await apiService.companyLogin(username, password);
        if (!response.data) {
        throw new Error(response.message || 'Login failed');
        }
        const userData = {
        id: response.data.company.id,
        username: response.data.company.username,
        email: response.data.company.email,
        role: 'company_admin' as const,
        first_name: response.data.company.contact_person_name.split(' ')[0],
        last_name: response.data.company.contact_person_name.split(' ')[1] || '',
        phone_number: response.data.company.phone,
        country_code: 'US',
        is_active: 1,
        last_login: new Date().toISOString(),
        created_at: response.data.company.created_at,
        updated_at: response.data.company.updated_at,
        company: response.data.company
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        set({ user: userData, isAuthenticated: true });
      } else if (requiredRole === 'employee') {
        const response = await apiService.employeeLogin(username, password);
        if (!response.data) {
        throw new Error(response.message || 'Login failed');
        }
        const userData = {
        id: response.data.employee.id,
        email: response.data.employee.email,
        role: 'employee' as const,
        first_name: response.data.employee.name,
        last_name: response.data.employee.surname,
        username: response.data.employee.employee_id,
        phone_number: response.data.employee.contact_no,
        country_code: 'US',
        is_active: 1,
        last_login: new Date().toISOString(),
        created_at: response.data.employee.created_at,
        updated_at: response.data.employee.updated_at,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        set({ user: userData, isAuthenticated: true });
      } else {
        throw new Error('Invalid role specified');
      }
      } catch (error) {
        console.error('Login error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

