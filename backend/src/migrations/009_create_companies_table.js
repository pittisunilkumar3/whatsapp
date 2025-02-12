const db = require('../../db');

module.exports = {
	up: async () => {
		// Check if table exists
		const [tables] = await db.query(`
			SELECT TABLE_NAME 
			FROM information_schema.TABLES 
			WHERE TABLE_SCHEMA = DATABASE() 
			AND TABLE_NAME = 'companies'
		`);

		if (tables.length === 0) {
			// Create table only if it doesn't exist
			await db.query(`
				CREATE TABLE companies (
				id INT PRIMARY KEY AUTO_INCREMENT,
				username VARCHAR(100) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL,
				company_name VARCHAR(255) NOT NULL,
				trading_name VARCHAR(255),
				registration_number VARCHAR(100) UNIQUE,
				tax_number VARCHAR(100),
				industry VARCHAR(100),
				founded_date DATE,
				company_type VARCHAR(50),
				email VARCHAR(255),
				phone VARCHAR(50),
				fax VARCHAR(50),
				website VARCHAR(255),
				social_media_linkedin VARCHAR(255),
				social_media_twitter VARCHAR(255),
				social_media_facebook VARCHAR(255),
				street_address VARCHAR(255),
				building_name VARCHAR(100),
				floor_number VARCHAR(20),
				city VARCHAR(100),
				state VARCHAR(100),
				country VARCHAR(100),
				postal_code VARCHAR(20),
				mailing_address VARCHAR(255),
				mailing_city VARCHAR(100),
				mailing_state VARCHAR(100),
				mailing_country VARCHAR(100),
				mailing_postal_code VARCHAR(20),
				contact_person_name VARCHAR(200),
				contact_person_position VARCHAR(100),
				contact_person_email VARCHAR(255),
				contact_person_phone VARCHAR(50),
				contact_person_mobile VARCHAR(50),
				secondary_contact_name VARCHAR(200),
				secondary_contact_position VARCHAR(100),
				secondary_contact_email VARCHAR(255),
				secondary_contact_phone VARCHAR(50),
				employee_count INT,
				annual_revenue DECIMAL(15,2),
				company_description TEXT,
				business_hours VARCHAR(255),
				year_end_date DATE,
				bank_name VARCHAR(100),
				bank_account_name VARCHAR(100),
				bank_account_number VARCHAR(50),
				bank_swift_code VARCHAR(20),
				logo_url VARCHAR(255),
				parent_company_name VARCHAR(255),
				subsidiary_companies TEXT,
				operation_countries JSON,
				languages_spoken JSON,
				certifications TEXT,
				licenses TEXT,
				status VARCHAR(50) DEFAULT 'active',
				listing_status VARCHAR(50),
				credit_rating VARCHAR(20),
				compliance_status VARCHAR(50),
				last_audit_date DATE,
				license_renewal_date DATE,
				insurance_renewal_date DATE,
				insurance_provider VARCHAR(100),
				insurance_policy_number VARCHAR(100),
				insurance_expiry_date DATE,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				created_by VARCHAR(100),
				updated_by VARCHAR(100),
				is_verified BOOLEAN DEFAULT false,
				verification_date DATE,
				two_factor_enabled BOOLEAN DEFAULT false,
				two_factor_secret VARCHAR(100),
				backup_codes JSON
			)
		`);

		// Create indexes
		const createIndex = async (indexName, column) => {
			try {
				await db.query(`CREATE INDEX ${indexName} ON companies(${column})`);
			} catch (error) {
				if (!error.message.includes('Duplicate')) {
					throw error;
				}
			}
		};

		await createIndex('idx_company_name', 'company_name');
		await createIndex('idx_registration', 'registration_number');
		await createIndex('idx_username', 'username');
		await createIndex('idx_email', 'email');
		await createIndex('idx_status', 'status');

		console.log('Companies table created successfully');
		} else {
			console.log('Companies table already exists');
		}
	},

	down: async () => {
		// Check for foreign key constraints
		await db.query('SET FOREIGN_KEY_CHECKS = 0');
		await db.query('DROP TABLE IF EXISTS companies');
		await db.query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('Companies table dropped successfully');
	}
};


