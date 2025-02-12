const db = require('../../db');

module.exports = {
	async up() {
		try {
			console.log('Creating call_leads table...');
			await db.query(`
				CREATE TABLE IF NOT EXISTS call_leads (
					lead_id INT AUTO_INCREMENT PRIMARY KEY,
					company_id INT NOT NULL,
					first_name VARCHAR(100),
					last_name VARCHAR(100),
					phone_number VARCHAR(20) NOT NULL,
					email VARCHAR(255),
					address TEXT,
					campaign_id INT,
					lead_status ENUM('New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up Scheduled', 'Closed'),
					lead_score INT DEFAULT 0,
					lead_score_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					is_active BOOLEAN DEFAULT TRUE,
					source VARCHAR(100),
					assigned_agent_id INT,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
					CONSTRAINT fk_call_leads_company FOREIGN KEY (company_id) REFERENCES companies(id),
					CONSTRAINT fk_call_leads_campaign FOREIGN KEY (campaign_id) REFERENCES call_campaigns(campaign_id),
					CONSTRAINT fk_call_leads_agent FOREIGN KEY (assigned_agent_id) REFERENCES call_agents(agent_id)
				)
			`);
			console.log('call_leads table created successfully');
		} catch (error) {
			console.error('Error creating call_leads table:', error);
			throw error;
		}
	},

	async down() {
		try {
			console.log('Dropping call_leads table...');
			await db.query('DROP TABLE IF EXISTS call_leads');
			console.log('call_leads table dropped successfully');
		} catch (error) {
			console.error('Error dropping call_leads table:', error);
			throw error;
		}
	}
};