const db = require('../../db');

module.exports = {
	up: async () => {
		// Check if table exists
		const [tables] = await db.query(`
			SELECT TABLE_NAME 
			FROM information_schema.TABLES 
			WHERE TABLE_SCHEMA = DATABASE() 
			AND TABLE_NAME = 'company_employee'
		`);

		if (tables.length === 0) {
			// Create table only if it doesn't exist
			await db.query(`
				CREATE TABLE company_employee (
					id INT PRIMARY KEY AUTO_INCREMENT,
					company_id INT NOT NULL,
					employee_id VARCHAR(200) NOT NULL,
					lang_id INT NOT NULL,
					currency_id INT DEFAULT 0,
					department INT NULL,
					designation INT NULL,
					qualification VARCHAR(200) NOT NULL,
					work_exp VARCHAR(200) NOT NULL,
					name VARCHAR(200) NOT NULL,
					surname VARCHAR(200) NOT NULL,
					father_name VARCHAR(200) NOT NULL,
					mother_name VARCHAR(200) NOT NULL,
					contact_no VARCHAR(200) NOT NULL,
					emergency_contact_no VARCHAR(200) NOT NULL,
					email VARCHAR(200) NOT NULL,
					dob DATE NOT NULL,
					marital_status VARCHAR(100) NOT NULL,
					date_of_joining DATE NULL,
					date_of_leaving DATE NULL,
					local_address VARCHAR(300) NOT NULL,
					permanent_address VARCHAR(200) NOT NULL,
					note VARCHAR(200) NOT NULL,
					image VARCHAR(200) NOT NULL,
					password VARCHAR(250) NOT NULL,
					gender VARCHAR(50) NOT NULL,
					account_title VARCHAR(200) NOT NULL,
					bank_account_no VARCHAR(200) NOT NULL,
					bank_name VARCHAR(200) NOT NULL,
					ifsc_code VARCHAR(200) NOT NULL,
					bank_branch VARCHAR(100) NOT NULL,
					payscale VARCHAR(200) NOT NULL,
					basic_salary INT NULL,
					epf_no VARCHAR(200) NOT NULL,
					contract_type VARCHAR(100) NOT NULL,
					shift VARCHAR(100) NOT NULL,
					location VARCHAR(100) NOT NULL,
					facebook VARCHAR(200) NOT NULL,
					twitter VARCHAR(200) NOT NULL,
					linkedin VARCHAR(200) NOT NULL,
					instagram VARCHAR(200) NOT NULL,
					resume VARCHAR(200) NOT NULL,
					joining_letter VARCHAR(200) NOT NULL,
					resignation_letter VARCHAR(200) NOT NULL,
					other_document_name VARCHAR(200) NOT NULL,
					other_document_file VARCHAR(200) NOT NULL,
					user_id INT NOT NULL,
					is_active INT NOT NULL,
					verification_code VARCHAR(100) NOT NULL,
					zoom_api_key VARCHAR(100) NULL,
					zoom_api_secret VARCHAR(100) NULL,
					disable_at DATE NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
				)
			`);

			// Create indexes
			const createIndex = async (indexName, column) => {
				try {
					await db.query(`CREATE INDEX ${indexName} ON company_employee(${column})`);
				} catch (error) {
					if (!error.message.includes('Duplicate')) {
						throw error;
					}
				}
			};

			await createIndex('idx_company_id', 'company_id');
			await createIndex('idx_employee_id', 'employee_id');
			await createIndex('idx_email', 'email');
			await createIndex('idx_user_id', 'user_id');
			await createIndex('idx_is_active', 'is_active');

			console.log('Company Employee table created successfully');
		} else {
			console.log('Company Employee table already exists');
		}
	},

	down: async () => {
		// Check for foreign key constraints
		await db.query('SET FOREIGN_KEY_CHECKS = 0');
		await db.query('DROP TABLE IF EXISTS company_employee');
		await db.query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('Company Employee table dropped successfully');
	}
};