import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add request interceptor to include token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);




interface ProfileUpdateData {
	first_name?: string;
	last_name?: string;
	phone_number?: string;
}

interface CompanyUpdateData extends ProfileUpdateData {
	company_name?: string;
	website?: string;
	contact_person_name?: string;
	contact_person_email?: string;
	contact_person_phone?: string;
	contact_person_position?: string;
}

interface EmployeeLoginResponse {
	message: string;
	data: {
		token: string;
		employee: {
			id: number;
			company_id: number;
			employee_id: string;
			name: string;
			surname: string;
			email: string;
			contact_no: string;
			created_at: string;
			updated_at: string;
		}
	};
}

interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		id: number;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		phone_number: string;
		country_code: string;
		is_active: number;
		last_login: string;
		created_at: string;
		updated_at: string;
		deleted_at: null | string;
		password_reset_token: null | string;
		password_reset_expiry: null | string;
		two_factor_secret: null | string;
		two_factor_enabled: number;
	};
	token: string;
}

interface CompanyLoginResponse {
	message: string;
	data: {
		token: string;
		company: {
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
		}
	};
}

export const apiService = {
	superAdminLogin: async (email: string, password: string): Promise<LoginResponse> => {
		console.log('Attempting super admin login...');
		try {
			const response = await api.post('/api/superadmin/login', { email, password });
			return response.data;

		} catch (error) {
			console.error('API call error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	companyLogin: async (username: string, password: string): Promise<CompanyLoginResponse> => {
		try {
			const response = await api.post('/api/companies/login', { username, password });
			return response.data;

		} catch (error) {
			console.error('Company login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	employeeLogin: async (email: string, password: string): Promise<EmployeeLoginResponse> => {
		try {
			const response = await api.post('/api/company-employees/login', { email, password });
			return response.data;

		} catch (error) {
			console.error('Employee login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	updateSuperAdminProfile: async (data: ProfileUpdateData) => {
		const response = await api.put('/api/superadmin/profile', data);
		return response.data;
	},

	updateCompanyProfile: async (data: CompanyUpdateData) => {
		const response = await api.put('/api/companies/profile', data);
		return response.data;
	},

	updateEmployeeProfile: async (data: ProfileUpdateData) => {
		const response = await api.put('/api/company-employees/profile', data);
		return response.data;
	}
};