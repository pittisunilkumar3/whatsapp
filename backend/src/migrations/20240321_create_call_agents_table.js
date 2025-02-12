const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating call_agents table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS call_agents (
					agent_id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					agent_name VARCHAR(255) NOT NULL,
					agent_phone VARCHAR(20),
					email VARCHAR(255),
					performance_metrics JSON,
					is_active BOOLEAN DEFAULT TRUE,
					hire_date DATE,
					department VARCHAR(100),
					role VARCHAR(100),
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_call_agents_company FOREIGN KEY (company_id) REFERENCES companies(id)
				)
			`);
			console.log('call_agents table created successfully');
		} catch (error) {
			console.error('Error creating call_agents table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping call_agents table...');
			await db.query('DROP TABLE IF EXISTS call_agents');
			console.log('call_agents table dropped successfully');
		} catch (error) {
			console.error('Error dropping call_agents table:', error);
			throw error;
		}
	}
};