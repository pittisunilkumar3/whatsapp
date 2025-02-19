const db = require('../../db');

class VoiceLead {
    static async create(leadData) {
        await this.validateLeadData(leadData);
        const query = `INSERT INTO voice_leads SET ?`;
        return db.query(query, [leadData]);
    }

    static async findById(id, companyId) {
        const query = `SELECT * FROM voice_leads WHERE id = ? AND company_id = ?`;
        return db.query(query, [id, companyId]);
    }

    static async findByCompany(companyId, filters = {}) {
        let query = `SELECT * FROM voice_leads WHERE company_id = ?`;
        const values = [companyId];

        if (filters.campaign_id) {
            query += ` AND campaign_id = ?`;
            values.push(filters.campaign_id);
        }

        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
        }

        if (filters.assigned_to) {
            query += ` AND assigned_to = ?`;
            values.push(filters.assigned_to);
        }

        query += ` ORDER BY created_at DESC`;
        return db.query(query, values);
    }

    static async findByCampaign(campaignId, companyId, filters = {}) {
        let query = `SELECT * FROM voice_leads WHERE campaign_id = ? AND company_id = ?`;
        const values = [campaignId, companyId];

        if (filters.status) {
            query += ` AND status = ?`;
            values.push(filters.status);
        }

        if (filters.priority) {
            query += ` AND priority = ?`;
            values.push(filters.priority);
        }

        query += ` ORDER BY priority DESC, created_at ASC`;
        return db.query(query, values);
    }

    static async update(id, leadData, companyId) {
        await this.validateLeadData(leadData);
        const query = `UPDATE voice_leads SET ? WHERE id = ? AND company_id = ?`;
        return db.query(query, [leadData, id, companyId]);
    }

    static async delete(id, companyId) {
        const query = `DELETE FROM voice_leads WHERE id = ? AND company_id = ?`;
        return db.query(query, [id, companyId]);
    }

    static async updateStatus(id, status, subStatus = null, companyId) {
        const query = `UPDATE voice_leads SET status = ?, sub_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND company_id = ?`;
        return db.query(query, [status, subStatus, id, companyId]);
    }

    static async assignLead(id, assignedTo, assignedBy, companyId) {
        const query = `
            UPDATE voice_leads 
            SET assigned_to = ?, 
                last_modified_by = ?,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND company_id = ?
        `;
        return db.query(query, [assignedTo, assignedBy, id, companyId]);
    }

    static async scheduleLead(id, scheduledCallTime, scheduledBy, companyId) {
        const query = `
            UPDATE voice_leads 
            SET scheduled_call_time = ?,
                scheduled_by = ?,
                status = 'scheduled',
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND company_id = ?
        `;
        return db.query(query, [scheduledCallTime, scheduledBy, id, companyId]);
    }

    static async recordCallAttempt(id, callData, companyId) {
        const query = `
            UPDATE voice_leads 
            SET attempts_made = attempts_made + 1,
                last_attempt_time = CURRENT_TIMESTAMP,
                last_call_duration = ?,
                last_call_notes = ?,
                call_disposition = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND company_id = ?
        `;
        return db.query(query, [
            callData.duration,
            callData.notes,
            callData.disposition,
            callData.status,
            id,
            companyId
        ]);
    }

    static async markConverted(id, conversionData, companyId) {
        const query = `
            UPDATE voice_leads 
            SET is_converted = TRUE,
                conversion_date = CURRENT_TIMESTAMP,
                conversion_value = ?,
                status = 'completed',
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND company_id = ?
        `;
        return db.query(query, [conversionData.value, id, companyId]);
    }

    static async getLeadStats(campaignId, companyId) {
        const query = `
            SELECT 
                COUNT(*) as total_leads,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_leads,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_leads,
                SUM(CASE WHEN is_converted = TRUE THEN 1 ELSE 0 END) as converted_leads,
                AVG(lead_score) as average_lead_score,
                SUM(conversion_value) as total_conversion_value,
                AVG(last_call_duration) as average_call_duration
            FROM voice_leads 
            WHERE campaign_id = ? AND company_id = ?
        `;
        return db.query(query, [campaignId, companyId]);
    }

    static async validateLeadData(data) {
        const requiredFields = ['phone', 'status', 'company_id'];
        
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (data.status && !['pending', 'in_progress', 'completed', 'failed', 'scheduled', 'blacklisted'].includes(data.status)) {
            throw new Error('Invalid status value');
        }

        if (data.interest_level && !['low', 'medium', 'high'].includes(data.interest_level)) {
            throw new Error('Invalid interest level value');
        }

        if (data.lead_score && (data.lead_score < 0 || data.lead_score > 100)) {
            throw new Error('Lead score must be between 0 and 100');
        }

        if (!data.company_id || typeof data.company_id !== 'number') {
            throw new Error('Invalid company_id');
        }

        return true;
    }
}

module.exports = VoiceLead; 