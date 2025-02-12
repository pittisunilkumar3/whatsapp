const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating call_campaigns table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS call_campaigns (
					campaign_id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					campaign_name VARCHAR(255) NOT NULL,
					description TEXT,
					caller_id VARCHAR(20),
					voice_script TEXT,
					call_duration INT,
					call_schedule_start TIME,
					call_schedule_end TIME,
					call_frequency ENUM('Daily', 'Weekly', 'Monthly'),
					is_active BOOLEAN DEFAULT TRUE,
					budget DECIMAL(10, 2),
					currency VARCHAR(3),
					target_audience TEXT,
					completion_status ENUM('In Progress', 'Completed', 'Not Started') DEFAULT 'In Progress',
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_call_campaigns_company FOREIGN KEY (company_id) REFERENCES companies(id)
				)
			`);
			console.log('call_campaigns table created successfully');
		} catch (error) {
			console.error('Error creating call_campaigns table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping call_campaigns table...');
			await db.query('DROP TABLE IF EXISTS call_campaigns');
			console.log('call_campaigns table dropped successfully');
		} catch (error) {
			console.error('Error dropping call_campaigns table:', error);
			throw error;
		}
	}
};