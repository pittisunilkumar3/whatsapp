const db = require('../../db');

module.exports = {
    async up() {
        try {
            console.log('Creating voice_leads table...');
            await db.query(`
                CREATE TABLE IF NOT EXISTS voice_leads (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    campaign_id INT,
                    first_name VARCHAR(50),
                    last_name VARCHAR(50),
                    phone VARCHAR(20) NOT NULL,
                    alternate_phone VARCHAR(20),
                    email VARCHAR(255),
                    company_name VARCHAR(100),
                    job_title VARCHAR(100),
                    industry VARCHAR(100),
                    status ENUM('pending', 'in_progress', 'completed', 'failed', 'scheduled', 'blacklisted') NOT NULL,
                    sub_status VARCHAR(50),
                    priority INT DEFAULT 0,
                    attempts_made INT DEFAULT 0,
                    last_attempt_time DATETIME,
                    next_attempt_time DATETIME,
                    best_time_to_call TIME,
                    timezone VARCHAR(50),
                    preferred_language VARCHAR(50) DEFAULT 'en-US',
                    country VARCHAR(100),
                    state VARCHAR(100),
                    city VARCHAR(100),
                    address TEXT,
                    postal_code VARCHAR(20),
                    source VARCHAR(50),
                    source_details TEXT,
                    annual_revenue DECIMAL(15,2),
                    company_size VARCHAR(50),
                    lead_score INT CHECK (lead_score BETWEEN 0 AND 100),
                    interest_level ENUM('low', 'medium', 'high'),
                    call_disposition TEXT,
                    last_call_duration INT,
                    last_call_notes TEXT,
                    pain_points JSON,
                    requirements JSON,
                    custom_fields JSON,
                    do_not_call BOOLEAN DEFAULT FALSE,
                    blacklist_reason TEXT,
                    is_qualified BOOLEAN DEFAULT FALSE,
                    is_converted BOOLEAN DEFAULT FALSE,
                    conversion_date DATETIME,
                    conversion_value DECIMAL(15,2),
                    assigned_to INT,
                    notes TEXT,
                    created_by INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    last_modified_by INT,
                    scheduled_call_time DATETIME,
                    scheduled_by INT,
                    company_id INT NOT NULL,
                    CONSTRAINT fk_voice_leads_campaign FOREIGN KEY (campaign_id) REFERENCES voice_campaigns(id) ON DELETE SET NULL,
                    CONSTRAINT fk_voice_leads_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                    CONSTRAINT fk_voice_leads_assigned_to FOREIGN KEY (assigned_to) REFERENCES company_employee(id),
                    CONSTRAINT fk_voice_leads_created_by FOREIGN KEY (created_by) REFERENCES company_employee(id),
                    CONSTRAINT fk_voice_leads_modified_by FOREIGN KEY (last_modified_by) REFERENCES company_employee(id),
                    CONSTRAINT fk_voice_leads_scheduled_by FOREIGN KEY (scheduled_by) REFERENCES company_employee(id)
                )
            `);
            console.log('voice_leads table created successfully');
        } catch (error) {
            console.error('Error creating voice_leads table:', error);
            throw error;
        }
    },

    async down() {
        try {
            console.log('Dropping voice_leads table...');
            await db.query('DROP TABLE IF EXISTS voice_leads');
            console.log('voice_leads table dropped successfully');
        } catch (error) {
            console.error('Error dropping voice_leads table:', error);
            throw error;
        }
    }
}; 