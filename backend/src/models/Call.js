const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

class Call {
    static async create(data) {
        try {
            const callData = {
                company_id: data.companyid,
                campaign_id: data.campaignId,
                lead_id: data.leadid,
                call_id: data.callId,
                call_sid: data.callsid,
                call_status: data.call_status || 'initiated',
                call_duration: data.call_duration || 0,
                recording_url: data.recording_url || null,
                call_data: data.call_data ? JSON.stringify(data.call_data) : null,
                is_active: true
            };

            console.log('Creating call with data:', callData);

            const query = 'INSERT INTO voice_calls SET ' + 
                Object.keys(callData)
                    .map(key => `${key} = :${key}`)
                    .join(', ');

            console.log('SQL Query:', query);

            const [result] = await sequelize.query(query, {
                replacements: callData,
                type: QueryTypes.INSERT
            });

            console.log('Query result:', result);
            return result;
        } catch (error) {
            console.error('Error creating call:', error);
            throw error;
        }
    }

    static async findById(id, companyid) {
        try {
            const [rows] = await sequelize.query(
                'SELECT * FROM voice_calls WHERE id = :id AND company_id = :companyid AND is_active = TRUE',
                {
                    replacements: { id, companyid },
                    type: QueryTypes.SELECT
                }
            );
            
            if (!rows) {
                return null;
            }

            if (rows.call_data) {
                try {
                    rows.call_data = JSON.parse(rows.call_data);
                } catch (e) {
                    console.warn('Error parsing call_data JSON:', e);
                    rows.call_data = {};
                }
            }
            
            return rows;
        } catch (error) {
            console.error('Error finding call:', error);
            throw error;
        }
    }

    static async findByLeadId(leadid, companyid) {
        try {
            const rows = await sequelize.query(
                'SELECT c.*, vc.name as campaign_name FROM voice_calls c LEFT JOIN voice_campaigns vc ON c.campaign_id = vc.id WHERE c.lead_id = :leadid AND c.company_id = :companyid AND c.is_active = TRUE ORDER BY c.created_at DESC',
                {
                    replacements: { leadid, companyid },
                    type: QueryTypes.SELECT
                }
            );
            rows.forEach(row => {
                if (row.call_data) {
                    row.call_data = JSON.parse(row.call_data);
                }
            });
            return rows;
        } catch (error) {
            console.error('Error finding calls by lead:', error);
            throw error;
        }
    }

    static async findByCampaignId(campaignId, companyid, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const rows = await sequelize.query(
                'SELECT c.*, vl.phone, vl.name, vl.email FROM voice_calls c LEFT JOIN voice_leads vl ON c.lead_id = vl.id WHERE c.campaign_id = :campaignId AND c.company_id = :companyid AND c.is_active = TRUE ORDER BY c.created_at DESC LIMIT :limit OFFSET :offset',
                {
                    replacements: { campaignId, companyid, limit, offset },
                    type: QueryTypes.SELECT
                }
            );
            
            const [{ count }] = await sequelize.query(
                'SELECT COUNT(*) as count FROM voice_calls WHERE campaign_id = :campaignId AND company_id = :companyid AND is_active = TRUE',
                {
                    replacements: { campaignId, companyid },
                    type: QueryTypes.SELECT
                }
            );

            rows.forEach(row => {
                if (row.call_data) {
                    row.call_data = JSON.parse(row.call_data);
                }
            });

            return {
                calls: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            console.error('Error getting calls by campaign:', error);
            throw error;
        }
    }

    static async findByCallSid(callsid, companyid) {
        try {
            const [row] = await sequelize.query(
                'SELECT c.*, vl.phone, vl.name FROM voice_calls c LEFT JOIN voice_leads vl ON c.lead_id = vl.id WHERE c.call_sid = :callsid AND c.company_id = :companyid AND c.is_active = TRUE',
                {
                    replacements: { callsid, companyid },
                    type: QueryTypes.SELECT
                }
            );
            if (row && row.call_data) {
                row.call_data = JSON.parse(row.call_data);
            }
            return row;
        } catch (error) {
            console.error('Error finding call by SID:', error);
            throw error;
        }
    }

    static async update(id, companyid, updates) {
        try {
            // Convert camelCase to snake_case for database columns
            const dbUpdates = {};
            if (updates.callId) dbUpdates.call_id = updates.callId;
            if (updates.callsid) dbUpdates.call_sid = updates.callsid;
            if (updates.leadid) dbUpdates.lead_id = updates.leadid;
            if (updates.companyid) dbUpdates.company_id = updates.companyid;
            if (updates.campaignId) dbUpdates.campaign_id = updates.campaignId;
            if (updates.call_status) dbUpdates.call_status = updates.call_status;
            if (updates.call_duration) dbUpdates.call_duration = updates.call_duration;
            if (updates.recording_url) dbUpdates.recording_url = updates.recording_url;
            if (updates.call_data) dbUpdates.call_data = JSON.stringify(updates.call_data);

            const setClause = Object.keys(dbUpdates)
                .map(key => `${key} = :${key}`)
                .join(', ');

            const query = `UPDATE voice_calls SET ${setClause} WHERE id = :id AND company_id = :companyid AND is_active = TRUE`;

            console.log('SQL Query:', query);
            console.log('Update data:', { ...dbUpdates, id, companyid });

            const [result] = await sequelize.query(query, {
                replacements: { ...dbUpdates, id, companyid },
                type: QueryTypes.UPDATE
            });
            return result > 0;
        } catch (error) {
            console.error('Error updating call:', error);
            throw error;
        }
    }

    static async delete(id, companyid) {
        try {
            const [result] = await sequelize.query(
                'UPDATE voice_calls SET is_active = FALSE WHERE id = :id AND company_id = :companyid AND is_active = TRUE',
                {
                    replacements: { id, companyid },
                    type: QueryTypes.UPDATE
                }
            );
            return result > 0;
        } catch (error) {
            console.error('Error deleting call:', error);
            throw error;
        }
    }

    static async getCallsByCompany(companyid, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const rows = await sequelize.query(
                'SELECT c.*, vl.phone, vl.name, vl.email, vc.name as campaign_name FROM voice_calls c LEFT JOIN voice_leads vl ON c.lead_id = vl.id LEFT JOIN voice_campaigns vc ON c.campaign_id = vc.id WHERE c.company_id = :companyid AND c.is_active = TRUE ORDER BY c.created_at DESC LIMIT :limit OFFSET :offset',
                {
                    replacements: { companyid, limit, offset },
                    type: QueryTypes.SELECT
                }
            );
            
            const [{ count }] = await sequelize.query(
                'SELECT COUNT(*) as count FROM voice_calls WHERE company_id = :companyid AND is_active = TRUE',
                {
                    replacements: { companyid },
                    type: QueryTypes.SELECT
                }
            );

            rows.forEach(row => {
                if (row.call_data) {
                    row.call_data = JSON.parse(row.call_data);
                }
            });

            return {
                calls: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            console.error('Error getting calls:', error);
            throw error;
        }
    }
}

module.exports = Call;
