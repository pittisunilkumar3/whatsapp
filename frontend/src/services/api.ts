import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Add request interceptor to include token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		console.log('Request config:', {
			url: config.url,
			method: config.method,
			hasToken: !!token
		});
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

interface Role {
	id: number;
	name: string;
	slug: string;
	is_active: boolean;
	is_system: boolean;
	is_superadmin: boolean;
	created_at: string;
	updated_at: string;
}

interface CreateRoleResponse {
	message: string;
	data: {
		insertId: number;
		affectedRows: number;
	};
}

interface RoleListResponse {
	data: Role[];
}

interface UpdateRoleResponse {
	message: string;
}

interface DeleteRoleResponse {
	message: string;
}

interface CompanyRole {
	id: number;
	company_id: number;
	name: string;
	slug: string;
	is_active: number;
	is_system: number;
	is_superadmin: number;
	created_at?: string;
	updated_at?: string;
}

interface CreateCompanyRoleResponse {
	success: boolean;
	message: string;
	data: CompanyRole;
}

interface ListCompanyRolesResponse {
	success: boolean;
	data: CompanyRole[];
}

interface UpdateCompanyRoleResponse {
	success: boolean;
	message: string;
	data: CompanyRole;
}

interface DeleteCompanyRoleResponse {
	success: boolean;
	message: string;
}

export const apiService = {
	superAdminLogin: async (email: string, password: string): Promise<LoginResponse> => {
		console.log('Attempting super admin login...');
		try {
			const response = await api.post('/superadmin/login', { email, password });
			return response.data;

		} catch (error) {
			console.error('API call error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	companyLogin: async (username: string, password: string): Promise<CompanyLoginResponse> => {
		try {
			const response = await api.post('/companies/login', { username, password });
			return response.data;

		} catch (error) {
			console.error('Company login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	employeeLogin: async (email: string, password: string): Promise<EmployeeLoginResponse> => {
		try {
			const response = await api.post('/company-employees/login', { email, password });
			return response.data;

		} catch (error) {
			console.error('Employee login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	updateSuperAdminProfile: async (data: ProfileUpdateData) => {
		const response = await api.put('/superadmin/profile', data);
		return response.data;
	},

	createRole: async (data: { 
		name: string; 
		slug: string; 
		is_active: boolean; 
		is_system: boolean; 
		is_superadmin: boolean; 
	}): Promise<CreateRoleResponse> => {
		const response = await api.post('/roles', data);
		return response.data;
	},

	listRoles: async (): Promise<RoleListResponse> => {
		const response = await api.get('/roles');
		return response.data;
	},

	updateRole: async (id: number, data: {
		name?: string;
		slug?: string;
		is_active?: boolean;
		is_system?: boolean;
		is_superadmin?: boolean;
	}): Promise<UpdateRoleResponse> => {
		console.log('Sending update request:', { id, data });
		const response = await api.put(`/roles/${id}`, data);
		return response.data;
	},

	deleteRole: async (id: number): Promise<DeleteRoleResponse> => {
		const response = await api.delete(`/roles/${id}`);
		return response.data;
	},

	createCompanyRole: async (data: {
		company_id: number;
		name: string;
		slug: string;
		is_active: number;
		is_system: number;
		is_superadmin: number;
	}): Promise<CreateCompanyRoleResponse> => {
		const response = await api.post('/company-roles', data);
		return response.data;
	},

	listCompanyRoles: async (params?: {
		company_id?: number;
		is_active?: number;
		is_system?: number;
	}): Promise<ListCompanyRolesResponse> => {
		const response = await api.get('/company-roles', { params });
		return response.data;
	},

	updateCompanyRole: async (
		id: number,
		data: {
			company_id: number;
			name: string;
			slug: string;
			is_active: number;
			is_system: number;
			is_superadmin: number;
		}
	): Promise<UpdateCompanyRoleResponse> => {
		const response = await api.put(`/company-roles/${id}`, data);
		return response.data;
	},

	deleteCompanyRole: async (id: number): Promise<DeleteCompanyRoleResponse> => {
		const response = await api.delete(`/company-roles/${id}`);
		return response.data;
	}
};








