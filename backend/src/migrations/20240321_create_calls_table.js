const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating calls table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS calls (
					call_id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					call_lead_id INT,
					call_agent_id INT,
					call_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					call_duration INT,
					call_outcome ENUM('Success', 'No Answer', 'Voicemail', 'Wrong Number'),
					notes TEXT,
					follow_up_date DATE,
					follow_up_time TIME,
					recording_url VARCHAR(255),
					is_active BOOLEAN DEFAULT TRUE,
					call_type ENUM('Inbound', 'Outbound'),
					call_result ENUM('Completed', 'Abandoned', 'Failed'),
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_calls_company FOREIGN KEY (company_id) REFERENCES companies(id),
					CONSTRAINT fk_calls_lead FOREIGN KEY (call_lead_id) REFERENCES call_leads(lead_id),
					CONSTRAINT fk_calls_agent FOREIGN KEY (call_agent_id) REFERENCES call_agents(agent_id)
				)
			`);
			console.log('calls table created successfully');
		} catch (error) {
			console.error('Error creating calls table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping calls table...');
			await db.query('DROP TABLE IF EXISTS calls');
			console.log('calls table dropped successfully');
		} catch (error) {
			console.error('Error dropping calls table:', error);
			throw error;
		}
	}
};