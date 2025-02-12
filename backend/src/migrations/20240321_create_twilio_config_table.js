const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating twilio_config table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS twilio_config (
					id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					account_sid VARCHAR(255) NOT NULL,
					auth_token VARCHAR(255) NOT NULL,
					phone_number VARCHAR(50) NOT NULL,
					messaging_service_sid VARCHAR(255),
					region VARCHAR(50) NOT NULL DEFAULT 'us1',
					api_base_url VARCHAR(255) NOT NULL DEFAULT 'https://api.twilio.com',
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_twilio_config_company FOREIGN KEY (company_id) REFERENCES companies(id)
				)
			`);
			console.log('twilio_config table created successfully');
		} catch (error) {
			console.error('Error creating twilio_config table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping twilio_config table...');
			await db.query('DROP TABLE IF EXISTS twilio_config');
			console.log('twilio_config table dropped successfully');
		} catch (error) {
			console.error('Error dropping twilio_config table:', error);
			throw error;
		}
	}
};