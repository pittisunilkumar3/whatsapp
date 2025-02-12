const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating call_reports table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS call_reports (
					report_id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					campaign_id INT,
					total_calls INT,
					successful_calls INT,
					unsuccessful_calls INT,
					avg_call_duration INT,
					agent_performance JSON,
					report_date DATE,
					report_period_start DATE,
					report_period_end DATE,
					is_active BOOLEAN DEFAULT TRUE,
					report_type ENUM('Daily', 'Weekly', 'Monthly'),
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_call_reports_company FOREIGN KEY (company_id) REFERENCES companies(id),
					CONSTRAINT fk_call_reports_campaign FOREIGN KEY (campaign_id) REFERENCES call_campaigns(campaign_id)
				)
			`);
			console.log('call_reports table created successfully');
		} catch (error) {
			console.error('Error creating call_reports table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping call_reports table...');
			await db.query('DROP TABLE IF EXISTS call_reports');
			console.log('call_reports table dropped successfully');
		} catch (error) {
			console.error('Error dropping call_reports table:', error);
			throw error;
		}
	}
};