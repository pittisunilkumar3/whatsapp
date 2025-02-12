const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating email_config table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS email_config (
					id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
					company_id INT UNSIGNED NOT NULL,
					email_type VARCHAR(100) NULL,
					smtp_server VARCHAR(100) NULL,
					smtp_port VARCHAR(100) NULL,
					smtp_username VARCHAR(100) NULL,
					smtp_password VARCHAR(100) NULL,
					ssl_tls VARCHAR(100) NULL,
					smtp_auth VARCHAR(10) NOT NULL,
					api_key VARCHAR(255) NULL,
					api_secret VARCHAR(255) NULL,
					region VARCHAR(255) NULL,
					is_active VARCHAR(10) NOT NULL DEFAULT 'no',
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (company_id) REFERENCES companies(id)
				)
			`);
			console.log('email_config table created successfully');
		} catch (error) {
			console.error('Error creating email_config table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping email_config table...');
			await db.query('SET FOREIGN_KEY_CHECKS = 0');
			await db.query('DROP TABLE IF EXISTS email_config');
			await db.query('SET FOREIGN_KEY_CHECKS = 1');
			console.log('email_config table dropped successfully');
		} catch (error) {
			console.error('Error dropping email_config table:', error);
			throw error;
		}
	}
};