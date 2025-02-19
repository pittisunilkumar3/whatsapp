const db = require('../../db');

class VoiceCampaign {
    static async create(campaignData) {
        await this.validateCampaignData(campaignData);
        const query = `INSERT INTO voice_campaigns SET ?`;
        return db.query(query, [campaignData]);
    }

    static async findById(id, companyId) {
        const query = `SELECT * FROM voice_campaigns WHERE id = ? AND company_id = ? AND is_active = TRUE`;
        return db.query(query, [id, companyId]);
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
        return db.query(query, values);
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
        return db.query(query, values);
    }

    static async update(id, campaignData, companyId) {
        await this.validateCampaignData(campaignData);
        const query = `UPDATE voice_campaigns SET ? WHERE id = ? AND company_id = ?`;
        return db.query(query, [campaignData, id, companyId]);
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

        if (!data.company_id || typeof data.company_id !== 'number') {
            throw new Error('Invalid company_id');
        }

        return true;
    }
}

module.exports = VoiceCampaign; 