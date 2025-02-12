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
			const response = await fetch('/api/superadmin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			
			if (!response.ok) {
				console.error('Login failed:', data);
				throw new Error(data.message || 'Login failed');
			}

			console.log('Login response:', data);
			return data;
		} catch (error) {
			console.error('API call error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	companyLogin: async (username: string, password: string): Promise<CompanyLoginResponse> => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			return data;
		} catch (error) {
			console.error('Company login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	},

	employeeLogin: async (email: string, password: string): Promise<EmployeeLoginResponse> => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/company-employees/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			return data;
		} catch (error) {
			console.error('Employee login error:', error);
			throw error instanceof Error ? error : new Error('Network error occurred');
		}
	}
};