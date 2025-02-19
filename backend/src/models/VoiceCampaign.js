const db = require('../../db');

class VoiceCampaign {
    static async create(campaignData) {
        await this.validateCampaignData(campaignData);
        
        // Create a copy of the data to avoid modifying the original
        const formattedData = { ...campaignData };
        
        // Remove owner_id if present (since it's optional)
        if (formattedData.owner_id) {
            delete formattedData.owner_id;
        }

        // Remove team_members if present (since it's optional)
        if (formattedData.team_members) {
            delete formattedData.team_members;
        }
        
        // Format JSON fields
        if (Array.isArray(formattedData.working_days)) {
            formattedData.working_days = JSON.stringify(formattedData.working_days);
        }
        
        if (Array.isArray(formattedData.tags)) {
            formattedData.tags = JSON.stringify(formattedData.tags);
        }
        
        const query = `INSERT INTO voice_campaigns SET ?`;
        return db.query(query, [formattedData]);
    }

    static async findById(id, companyId) {
        const query = `SELECT * FROM voice_campaigns WHERE id = ? AND company_id = ? AND is_active = TRUE`;
        const [campaign] = await db.query(query, [id, companyId]);
        
        if (campaign) {
            // Parse JSON fields
            if (campaign.working_days) {
                campaign.working_days = JSON.parse(campaign.working_days);
            }
            if (campaign.team_members) {
                campaign.team_members = JSON.parse(campaign.team_members);
            }
            if (campaign.tags) {
                campaign.tags = JSON.parse(campaign.tags);
            }
        }
        
        return campaign;
    }

    static async findByCompany(companyId, filters = {}) {
        let query = `SELECT * FROM voice_campaigns WHERE company_id = ? AND is_active = TRUE`;
        const values = [companyId];

        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
        }

        if (filters.priority) {
            query += ` AND priority = ?`;
            values.push(filters.priority);
        }

        query += ` ORDER BY created_at DESC`;
        const campaigns = await db.query(query, values);
        
        // Parse JSON fields for each campaign
        return campaigns.map(campaign => {
            if (campaign.working_days) {
                campaign.working_days = JSON.parse(campaign.working_days);
            }
            if (campaign.team_members) {
                campaign.team_members = JSON.parse(campaign.team_members);
            }
            if (campaign.tags) {
                campaign.tags = JSON.parse(campaign.tags);
            }
            return campaign;
        });
    }

    static async findAll(filters = {}) {
        let query = `SELECT * FROM voice_campaigns WHERE is_active = TRUE`;
        const values = [];

        if (filters.company_id) {
            query += ` AND company_id = ?`;
            values.push(filters.company_id);
        }

        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
        }

        if (filters.priority) {
            query += ` AND priority = ?`;
            values.push(filters.priority);
        }

        if (filters.owner_id) {
            query += ` AND owner_id = ?`;
            values.push(filters.owner_id);
        }

        query += ` ORDER BY created_at DESC`;
        const campaigns = await db.query(query, values);
        
        // Parse JSON fields for each campaign
        return campaigns.map(campaign => {
            if (campaign.working_days) {
                campaign.working_days = JSON.parse(campaign.working_days);
            }
            if (campaign.team_members) {
                campaign.team_members = JSON.parse(campaign.team_members);
            }
            if (campaign.tags) {
                campaign.tags = JSON.parse(campaign.tags);
            }
            return campaign;
        });
    }

    static async update(id, campaignData, companyId) {
        await this.validateCampaignData(campaignData);
        
        // Create a copy of the data to avoid modifying the original
        const formattedData = { ...campaignData };
        
        // Format JSON fields
        if (Array.isArray(formattedData.working_days)) {
            formattedData.working_days = JSON.stringify(formattedData.working_days);
        }
        
        if (Array.isArray(formattedData.team_members)) {
            formattedData.team_members = JSON.stringify(formattedData.team_members);
        } else if (formattedData.team_members) {
            // If single value, convert to array then stringify
            formattedData.team_members = JSON.stringify([formattedData.team_members]);
        }
        
        if (Array.isArray(formattedData.tags)) {
            formattedData.tags = JSON.stringify(formattedData.tags);
        }
        
        const query = `UPDATE voice_campaigns SET ? WHERE id = ? AND company_id = ?`;
        return db.query(query, [formattedData, id, companyId]);
    }

    static async delete(id, companyId) {
        const query = `UPDATE voice_campaigns SET is_active = FALSE WHERE id = ? AND company_id = ?`;
        return db.query(query, [id, companyId]);
    }

    static async updateStatus(id, status, companyId) {
        const query = `UPDATE voice_campaigns SET status = ? WHERE id = ? AND company_id = ?`;
        return db.query(query, [status, id, companyId]);
    }

    static async getStats(id, companyId) {
        const query = `
            SELECT 
                total_leads,
                completed_calls,
                successful_calls,
                failed_calls,
                cost_per_call,
                budget,
                ROUND((successful_calls / NULLIF(completed_calls, 0)) * 100, 2) as success_rate,
                (cost_per_call * completed_calls) as total_cost,
                (budget - (cost_per_call * completed_calls)) as remaining_budget
            FROM voice_campaigns 
            WHERE id = ? AND company_id = ? AND is_active = TRUE
        `;
        return db.query(query, [id, companyId]);
    }

    static async validateCampaignData(data) {
        const requiredFields = [
            'name', 
            'status', 
            'calls_per_day', 
            'calling_hours_start', 
            'calling_hours_end', 
            'system_prompt', 
            'script_template', 
            'company_id'
        ];
        
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (data.status && !['draft', 'active', 'paused', 'completed'].includes(data.status)) {
            throw new Error('Invalid status value');
        }

        if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
            throw new Error('Invalid priority value');
        }

        // Validate working_days if provided
        if (data.working_days) {
            if (!Array.isArray(data.working_days)) {
                throw new Error('working_days must be an array');
            }
            
            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const invalidDays = data.working_days.filter(day => !validDays.includes(day));
            
            if (invalidDays.length > 0) {
                throw new Error(`Invalid working days: ${invalidDays.join(', ')}`);
            }
        }

        // Remove validation for team_members and owner_id since they're optional
        
        // Validate tags if provided
        if (data.tags && !Array.isArray(data.tags)) {
            throw new Error('tags must be an array');
        }

        if (!data.company_id || typeof data.company_id !== 'number') {
            throw new Error('Invalid company_id');
        }

        return true;
    }
}

module.exports = VoiceCampaign; 