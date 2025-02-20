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
        const [campaigns] = await db.query(query, [id, companyId]);
        
        if (!campaigns || campaigns.length === 0) {
            return null;
        }

        const campaign = campaigns[0];
        const processedCampaign = {};
        
        // Convert each field from Buffer if needed
        for (const [key, value] of Object.entries(campaign)) {
            if (Buffer.isBuffer(value)) {
                processedCampaign[key] = value.toString('utf8');
            } else {
                processedCampaign[key] = value;
            }
        }

        // Parse JSON fields
        if (processedCampaign.working_days) {
            try {
                processedCampaign.working_days = JSON.parse(processedCampaign.working_days);
            } catch (e) {
                processedCampaign.working_days = [];
            }
        }
        
        if (processedCampaign.team_members) {
            try {
                processedCampaign.team_members = JSON.parse(processedCampaign.team_members);
            } catch (e) {
                processedCampaign.team_members = [];
            }
        }
        
        if (processedCampaign.tags) {
            try {
                processedCampaign.tags = JSON.parse(processedCampaign.tags);
            } catch (e) {
                processedCampaign.tags = [];
            }
        }
        
        return processedCampaign;
    }

    static async findByCompany(companyId, filters = {}) {
        try {
            // Validate company ID
            if (!companyId || typeof companyId !== 'number') {
                throw new Error('Invalid company ID');
            }

            let query = `SELECT 
                vc.*,
                COALESCE(
                    (SELECT COUNT(*) FROM voice_leads vl WHERE vl.campaign_id = vc.id),
                    0
                ) as total_leads_count
            FROM voice_campaigns vc
            WHERE vc.company_id = ? AND vc.is_active = TRUE`;
            
            const values = [companyId];

            // Add filters
            if (filters.status) {
                query += ` AND vc.status = ?`;
                values.push(filters.status);
            }

            if (filters.priority) {
                query += ` AND vc.priority = ?`;
                values.push(filters.priority);
            }

            if (filters.search) {
                query += ` AND (vc.name LIKE ? OR vc.description LIKE ?)`;
                const searchTerm = `%${filters.search}%`;
                values.push(searchTerm, searchTerm);
            }

            if (filters.start_date) {
                query += ` AND vc.created_at >= ?`;
                values.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ` AND vc.created_at <= ?`;
                values.push(filters.end_date);
            }

            // Add sorting
            const validSortFields = ['created_at', 'name', 'status', 'priority'];
            const sortField = filters.sort && validSortFields.includes(filters.sort) ? filters.sort : 'created_at';
            const sortOrder = filters.order && filters.order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
            query += ` ORDER BY vc.${sortField} ${sortOrder}`;

            // Add pagination
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 10;
            const offset = (page - 1) * limit;
            query += ` LIMIT ? OFFSET ?`;
            values.push(limit, offset);

            // Get total count for pagination
            const countQuery = `SELECT COUNT(*) as total FROM voice_campaigns WHERE company_id = ? AND is_active = TRUE`;
            const [[{ total }], [campaigns]] = await Promise.all([
                db.query(countQuery, [companyId]),
                db.query(query, values)
            ]);

            // Process campaigns
            const processedCampaigns = campaigns.map(campaign => {
                const processedCampaign = {};
                
                // Convert Buffer to string and handle other fields
                for (const [key, value] of Object.entries(campaign)) {
                    if (Buffer.isBuffer(value)) {
                        processedCampaign[key] = value.toString('utf8');
                    } else if (key === 'created_at' || key === 'updated_at') {
                        processedCampaign[key] = value ? new Date(value).toISOString() : null;
                    } else {
                        processedCampaign[key] = value;
                    }
                }

                // Parse JSON fields
                ['working_days', 'team_members', 'tags'].forEach(field => {
                    if (processedCampaign[field]) {
                        try {
                            processedCampaign[field] = JSON.parse(processedCampaign[field]);
                        } catch (e) {
                            processedCampaign[field] = [];
                        }
                    }
                });

                return processedCampaign;
            });

            // Return with pagination info
            return {
                data: processedCampaigns,
                pagination: {
                    total,
                    page,
                    limit,
                    total_pages: Math.ceil(total / limit)
                }
            };

        } catch (error) {
            console.error('Error in findByCompany:', error);
            throw error;
        }
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
        const [campaigns] = await db.query(query, values);
        
        // Parse JSON fields and handle Buffer data for each campaign
        return campaigns.map(campaign => {
            const processedCampaign = {};
            
            // Convert each field from Buffer if needed and parse JSON fields
            for (const [key, value] of Object.entries(campaign)) {
                if (Buffer.isBuffer(value)) {
                    processedCampaign[key] = value.toString('utf8');
                } else {
                    processedCampaign[key] = value;
                }
            }

            // Parse JSON fields
            if (processedCampaign.working_days) {
                try {
                    processedCampaign.working_days = JSON.parse(processedCampaign.working_days);
                } catch (e) {
                    processedCampaign.working_days = [];
                }
            }
            
            if (processedCampaign.team_members) {
                try {
                    processedCampaign.team_members = JSON.parse(processedCampaign.team_members);
                } catch (e) {
                    processedCampaign.team_members = [];
                }
            }
            
            if (processedCampaign.tags) {
                try {
                    processedCampaign.tags = JSON.parse(processedCampaign.tags);
                } catch (e) {
                    processedCampaign.tags = [];
                }
            }

            return processedCampaign;
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


