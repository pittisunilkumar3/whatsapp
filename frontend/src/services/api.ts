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

interface TwilioConfigData {
	company_id: number;
	account_sid: string;
	auth_token: string;
	phone_number: string;
	messaging_service_sid: string;
	region: string;
	api_base_url: string;
}

interface TwilioConfigResponse {
	success: boolean;
	data: TwilioConfigData & {
		id: number;
		created_at: string;
		updated_at: string;
	};
}

interface TwilioConfigListResponse {
	success: boolean;
	data: Array<TwilioConfigData & {
		id: number;
		created_at: string;
		updated_at: string;
	}>;
}

interface UltravoxConfigData {
	company_id: number;
	apikey: string;
	apiurl: string;
	model?: string;
	voice?: string;
	firstspeaker?: string;
	system_prompt: string;
	is_active?: boolean;
}

interface UltravoxConfigResponse {
	success: boolean;
	data: UltravoxConfigData & {
		id: string;
		created_at: string;
		updated_at: string;
	};
}

interface UltravoxConfigListResponse {
	success: boolean;
	data: Array<UltravoxConfigData & {
		id: string;
		created_at: string;
		updated_at: string;
	}>;
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
	},

	// Create Twilio Configuration
	createTwilioConfig: async (data: TwilioConfigData): Promise<TwilioConfigResponse> => {
		const response = await api.post('/twilio-config', data);
		return response.data;
	},

	// Get Twilio Configuration by ID
	getTwilioConfigById: async (id: number): Promise<TwilioConfigResponse> => {
		const response = await api.get(`/twilio-config/${id}`);
		return response.data;
	},

	// Get Twilio Configuration by Company ID
	getTwilioConfigByCompany: async (companyId: number): Promise<TwilioConfigResponse> => {
		const response = await api.get(`/twilio-config/company/${companyId}`);
		return response.data;
	},

	// Update Twilio Configuration
	updateTwilioConfig: async (id: number, data: Partial<TwilioConfigData>): Promise<TwilioConfigResponse> => {
		const response = await api.put(`/twilio-config/${id}`, data);
		return response.data;
	},

	// Delete Twilio Configuration
	deleteTwilioConfig: async (id: number): Promise<{ success: boolean; message: string }> => {
		const response = await api.delete(`/twilio-config/${id}`);
		return response.data;
	},

	// List All Twilio Configurations
	listTwilioConfigs: async (): Promise<TwilioConfigListResponse> => {
		const response = await api.get('/twilio-config');
		return response.data;
	},

	// Create Ultravox Configuration
	createUltravoxConfig: async (data: UltravoxConfigData): Promise<UltravoxConfigResponse> => {
		const response = await api.post('/ultravox-config', data);
		return response.data;
	},

	// Get Ultravox Configuration by ID
	getUltravoxConfigById: async (id: string): Promise<UltravoxConfigResponse> => {
		const response = await api.get(`/ultravox-config/${id}`);
		return response.data;
	},

	// Get Ultravox Configuration by Company ID
	getUltravoxConfigByCompany: async (companyId: number): Promise<UltravoxConfigResponse> => {
		console.log('Calling Ultravox API for company:', companyId);
		const url = `/ultravox-config/company/${companyId}`;
		console.log('API URL:', url);
		try {
			const response = await api.get(url);
			console.log('API Response:', response.data);
			return response.data;
		} catch (error) {
			console.error('API Error:', error);
			if (error.response) {
				console.error('Error Response:', error.response.data);
				console.error('Error Status:', error.response.status);
			}
			throw error;
		}
	},

	// Update Ultravox Configuration
	updateUltravoxConfig: async (id: string, data: Partial<UltravoxConfigData>): Promise<UltravoxConfigResponse> => {
		const response = await api.put(`/ultravox-config/${id}`, data);
		return response.data;
	},

	// Delete Ultravox Configuration
	deleteUltravoxConfig: async (id: string): Promise<{ success: boolean; message: string }> => {
		const response = await api.delete(`/ultravox-config/${id}`);
		return response.data;
	},

	// List All Ultravox Configurations
	listUltravoxConfigs: async (): Promise<UltravoxConfigListResponse> => {
		const response = await api.get('/ultravox-config');
		return response.data;
	},
};








