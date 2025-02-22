const db = require('../../db');

module.exports = {
    async up() {
        try {
            console.log('Creating voice_calls table...');
            
            // First check if the table exists
            const [tables] = await db.query('SHOW TABLES LIKE "voice_calls"');
            if (tables.length > 0) {
                console.log('voice_calls table already exists, checking for call_data column...');
                
                // Check if call_data column exists
                const [columns] = await db.query('SHOW COLUMNS FROM voice_calls LIKE "call_data"');
                if (columns.length === 0) {
                    console.log('Adding call_data column...');
                    await db.query('ALTER TABLE voice_calls ADD COLUMN call_data JSON DEFAULT NULL COMMENT "Additional call metadata like direction, phone numbers, etc"');
                    console.log('call_data column added successfully');
                } else {
                    console.log('call_data column already exists');
                }
                return;
            }

            await db.query(`
                CREATE TABLE IF NOT EXISTS voice_calls (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    company_id INT NOT NULL,
                    campaign_id INT NOT NULL,
                    lead_id INT NOT NULL,
                    call_id VARCHAR(255) NOT NULL COMMENT 'Ultravox call ID',
                    call_sid VARCHAR(255) NOT NULL COMMENT 'Twilio call SID',
                    call_status ENUM('initiated', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'cancelled') NOT NULL DEFAULT 'initiated',
                    call_duration INT COMMENT 'Call duration in seconds',
                    recording_url VARCHAR(255),
                    call_data JSON DEFAULT NULL COMMENT 'Additional call metadata like direction, phone numbers, etc',
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    CONSTRAINT fk_voice_calls_company FOREIGN KEY (company_id) REFERENCES companies(id),
                    CONSTRAINT fk_voice_calls_campaign FOREIGN KEY (campaign_id) REFERENCES voice_campaigns(id),
                    CONSTRAINT fk_voice_calls_lead FOREIGN KEY (lead_id) REFERENCES voice_leads(id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);
            console.log('voice_calls table created successfully');
        } catch (error) {
            console.error('Error in migration:', error);
            throw error;
        }
    },

    async down() {
        try {
            console.log('Dropping voice_calls table...');
            await db.query('DROP TABLE IF EXISTS voice_calls');
            console.log('voice_calls table dropped successfully');
        } catch (error) {
            console.error('Error dropping voice_calls table:', error);
            throw error;
        }
    }
};
