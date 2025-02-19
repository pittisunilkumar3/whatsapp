const db = require('../../db');

module.exports = {
    async up() {
        try {
            console.log('Creating voice_campaigns table...');
            await db.query(`
                CREATE TABLE IF NOT EXISTS voice_campaigns (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    status ENUM('draft', 'active', 'paused', 'completed') NOT NULL,
                    priority ENUM('low', 'medium', 'high'),
                    campaign_type VARCHAR(50) DEFAULT 'outbound',
                    calls_per_day INT NOT NULL,
                    total_leads INT DEFAULT 0,
                    completed_calls INT DEFAULT 0,
                    successful_calls INT DEFAULT 0,
                    failed_calls INT DEFAULT 0,
                    calling_hours_start TIME NOT NULL,
                    calling_hours_end TIME NOT NULL,
                    time_zone VARCHAR(50) DEFAULT 'UTC',
                    working_days JSON DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
                    ai_voice_id VARCHAR(50),
                    ai_voice_language VARCHAR(50) DEFAULT 'en-US',
                    ai_voice_gender VARCHAR(10),
                    system_prompt TEXT NOT NULL,
                    script_template TEXT NOT NULL,
                    fallback_script TEXT,
                    max_attempts_per_lead INT DEFAULT 3,
                    retry_delay_minutes INT DEFAULT 60,
                    call_duration_limit INT,
                    success_criteria TEXT,
                    expected_completion_date DATE,
                    budget DECIMAL(15,2),
                    cost_per_call DECIMAL(10,2),
                    owner_id INT,
                    team_members JSON,
                    tags JSON,
                    notes TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    last_modified_by INT,
                    start_date DATETIME NULL,
                    end_date DATETIME NULL,
                    recurrence_rule TEXT,
                    company_id INT NOT NULL,
                    CONSTRAINT fk_voice_campaigns_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                    CONSTRAINT fk_voice_campaigns_owner FOREIGN KEY (owner_id) REFERENCES company_employee(id),
                    CONSTRAINT fk_voice_campaigns_created_by FOREIGN KEY (created_by) REFERENCES company_employee(id),
                    CONSTRAINT fk_voice_campaigns_modified_by FOREIGN KEY (last_modified_by) REFERENCES company_employee(id)
                )
            `);
            console.log('voice_campaigns table created successfully');
        } catch (error) {
            console.error('Error creating voice_campaigns table:', error);
            throw error;
        }
    },

    async down() {
        try {
            console.log('Dropping voice_campaigns table...');
            await db.query('DROP TABLE IF EXISTS voice_campaigns');
            console.log('voice_campaigns table dropped successfully');
        } catch (error) {
            console.error('Error dropping voice_campaigns table:', error);
            throw error;
        }
    }
}; 