const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating ultravox_configurations table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS ultravox_configurations (
					id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					apikey VARCHAR(255) NOT NULL,
					apiurl VARCHAR(255) NOT NULL,
					model VARCHAR(255) NOT NULL DEFAULT 'fixie-ai/ultravox',
					voice VARCHAR(50) NOT NULL DEFAULT 'terrence',
					firstspeaker VARCHAR(50) NOT NULL DEFAULT 'FIRST_SPEAKER_USER',
					system_prompt TEXT NOT NULL,
					is_active BOOLEAN DEFAULT TRUE,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_ultravox_config_company FOREIGN KEY (company_id) REFERENCES companies(id)
				)
			`);
			console.log('ultravox_configurations table created successfully');
		} catch (error) {
			console.error('Error creating ultravox_configurations table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping ultravox_configurations table...');
			await db.query('DROP TABLE IF EXISTS ultravox_configurations');
			console.log('ultravox_configurations table dropped successfully');
		} catch (error) {
			console.error('Error dropping ultravox_configurations table:', error);
			throw error;
		}
	}
};
