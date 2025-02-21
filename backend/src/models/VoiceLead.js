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

    static async bulkImport(companyId, campaignId, leads, defaultValues = {}) {
        // Validate campaign exists and belongs to company
        const campaignQuery = `SELECT id FROM voice_campaigns WHERE id = ? AND company_id = ?`;
        const [campaign] = await db.query(campaignQuery, [campaignId, companyId]);
        
        if (!campaign) {
            throw new Error('Invalid campaign_id or campaign does not belong to company');
        }

        // Prepare leads data with default values and required fields
        const preparedLeads = leads.map(lead => {
            // Handle tags by moving them to custom_fields
            let customFields = lead.custom_fields || {};
            if (lead.tags) {
                customFields = {
                    ...customFields,
                    tags: lead.tags
                };
                delete lead.tags;
            }

            return {
                ...defaultValues,
                ...lead,
                campaign_id: campaignId,
                company_id: companyId,
                status: lead.status || defaultValues.status || 'pending',
                created_at: new Date(),
                updated_at: new Date(),
                custom_fields: JSON.stringify(customFields) // Ensure custom_fields is properly serialized
            };
        });

        // Validate all leads data
        for (const lead of preparedLeads) {
            await this.validateLeadData(lead);
        }

        // Use transaction for bulk insert
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const insertQuery = `INSERT INTO voice_leads SET ?`;
            const insertedLeads = [];

            for (const lead of preparedLeads) {
                const [result] = await connection.query(insertQuery, lead);
                // For the response, parse custom_fields back to an object
                const returnLead = {
                    id: result.insertId,
                    ...lead,
                    custom_fields: JSON.parse(lead.custom_fields)
                };
                insertedLeads.push(returnLead);
            }

            await connection.commit();
            return insertedLeads;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async validateLeadData(leadData) {
        const requiredFields = ['phone'];
        const missingFields = requiredFields.filter(field => !leadData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate phone number format (E.164)
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(leadData.phone)) {
            throw new Error('Phone number must be in E.164 format (e.g., +1234567890)');
        }

        // Validate email if provided
        if (leadData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(leadData.email)) {
                throw new Error('Invalid email format');
            }
        }

        // Validate lead score if provided
        if (leadData.lead_score !== undefined) {
            const score = parseInt(leadData.lead_score);
            if (isNaN(score) || score < 0 || score > 100) {
                throw new Error('Lead score must be between 0 and 100');
            }
        }

        // Validate status if provided
        if (leadData.status) {
            const validStatuses = ['pending', 'in_progress', 'completed', 'failed', 'scheduled', 'blacklisted'];
            if (!validStatuses.includes(leadData.status)) {
                throw new Error('Invalid status value');
            }
        }

        // Validate interest level if provided
        if (leadData.interest_level) {
            const validInterestLevels = ['low', 'medium', 'high'];
            if (!validInterestLevels.includes(leadData.interest_level)) {
                throw new Error('Invalid interest level. Must be one of: low, medium, high');
            }
        }

        // Handle tags by moving them to custom_fields if provided
        if (leadData.tags) {
            if (!Array.isArray(leadData.tags)) {
                throw new Error('Tags must be an array');
            }
            
            // Store tags in custom_fields
            leadData.custom_fields = {
                ...leadData.custom_fields,
                tags: leadData.tags
            };
            
            // Remove tags from root level since it's not a database column
            delete leadData.tags;
        }
    }
}

module.exports = VoiceLead; 