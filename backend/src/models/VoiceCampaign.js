const db = require('../../db');
const axios = require('axios'); // Make sure to install axios if not already installed
const twilio = require('twilio');
const https = require('https');
const TwilioConfig = require('../models/TwilioConfig');
const UltravoxConfiguration = require('../models/UltravoxConfiguration');

class VoiceCampaign {
    static async create(campaignData) {
        await this.validateCampaignData(campaignData);
        
        // Create a copy of the data to avoid modifying the original
        const formattedData = { ...campaignData };
        
        // Validate owner_id exists in company_employee table if provided
        if (formattedData.owner_id) {
            try {
                const [owners] = await db.query(
                    'SELECT id, company_id FROM company_employee WHERE id = ?',
                    [formattedData.owner_id]
                );
                
                if (!owners || owners.length === 0) {
                    throw new Error(`Owner with ID ${formattedData.owner_id} not found in company_employee table`);
                }

                const owner = owners[0];
                if (owner.company_id !== formattedData.company_id) {
                    throw new Error(`Owner with ID ${formattedData.owner_id} belongs to company ${owner.company_id}, not ${formattedData.company_id}`);
                }
            } catch (error) {
                console.error('Error validating owner:', error);
                throw new Error(`Invalid owner_id: ${error.message}`);
            }
        } else {
            // If owner_id is not provided, set it to null explicitly
            formattedData.owner_id = null;
        }
        
        // Format JSON fields
        if (Array.isArray(formattedData.working_days)) {
            formattedData.working_days = JSON.stringify(formattedData.working_days);
        }
        
        if (Array.isArray(formattedData.team_members)) {
            // Validate team members exist in company_employee table
            if (formattedData.team_members.length > 0) {
                try {
                    const [teamMembers] = await db.query(
                        'SELECT id, company_id FROM company_employee WHERE id IN (?)',
                        [formattedData.team_members]
                    );
                    
                    if (!teamMembers || teamMembers.length !== formattedData.team_members.length) {
                        const foundIds = teamMembers.map(member => member.id);
                        const invalidIds = formattedData.team_members.filter(id => !foundIds.includes(id));
                        throw new Error(`Team members with IDs ${invalidIds.join(', ')} not found`);
                    }

                    // Verify all team members belong to the same company
                    const invalidMembers = teamMembers.filter(member => member.company_id !== formattedData.company_id);
                    if (invalidMembers.length > 0) {
                        throw new Error(`Team members with IDs ${invalidMembers.map(m => m.id).join(', ')} do not belong to company ${formattedData.company_id}`);
                    }
                } catch (error) {
                    console.error('Error validating team members:', error);
                    throw new Error(`Invalid team_members: ${error.message}`);
                }
            }
            formattedData.team_members = JSON.stringify(formattedData.team_members);
        } else {
            // If team_members is not provided, set it to empty array
            formattedData.team_members = JSON.stringify([]);
        }
        
        if (Array.isArray(formattedData.tags)) {
            formattedData.tags = JSON.stringify(formattedData.tags);
        }
        
        const query = `INSERT INTO voice_campaigns SET ?`;
        const [result] = await db.query(query, [formattedData]);
        
        // Fetch the newly created campaign
        const [newCampaign] = await db.query(
            'SELECT * FROM voice_campaigns WHERE id = ?',
            [result.insertId]
        );

        if (!newCampaign || newCampaign.length === 0) {
            throw new Error('Failed to fetch created campaign');
        }

        // Process the campaign data
        const processedCampaign = {};
        for (const [key, value] of Object.entries(newCampaign[0])) {
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

        return { insertId: result.insertId, campaign: processedCampaign };
    }

    static async findById(id, companyId) {
        try {
            console.log('Finding campaign by ID:', { id, companyId });
            const query = `
                SELECT 
                    vc.*,
                    COUNT(DISTINCT vl.id) as total_leads,
                    SUM(CASE WHEN vl.status = 'completed' THEN 1 ELSE 0 END) as completed_calls,
                    SUM(CASE WHEN vl.status = 'completed' AND vl.is_converted = TRUE THEN 1 ELSE 0 END) as successful_calls,
                    SUM(CASE WHEN vl.status = 'failed' THEN 1 ELSE 0 END) as failed_calls,
                    SUM(CASE WHEN vl.status = 'pending' THEN 1 ELSE 0 END) as no_answer_calls,
                    AVG(CASE WHEN vl.last_call_duration IS NOT NULL THEN vl.last_call_duration ELSE 0 END) as average_duration
                FROM voice_campaigns vc
                LEFT JOIN voice_leads vl ON vc.id = vl.campaign_id
                WHERE vc.id = ? 
                AND vc.company_id = ?
                AND vc.is_active = TRUE
                GROUP BY vc.id
            `;

            const [campaigns] = await db.query(query, [id, companyId]);
            console.log('Found campaign:', campaigns);
            if (!campaigns || campaigns.length === 0) {
                return [];
            }

            // Process the campaign data
            const processedCampaign = {};
            for (const [key, value] of Object.entries(campaigns[0])) {
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

            // Calculate success rate and other metrics
            const totalCalls = parseInt(processedCampaign.completed_calls || 0);
            const successfulCalls = parseInt(processedCampaign.successful_calls || 0);
            const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

            // Add calculated metrics
            processedCampaign.metrics = {
                totalLeads: parseInt(processedCampaign.total_leads || 0),
                completedCalls: totalCalls,
                successfulCalls: successfulCalls,
                failedCalls: parseInt(processedCampaign.failed_calls || 0),
                noAnswerCalls: parseInt(processedCampaign.no_answer_calls || 0),
                successRate: Math.round(successRate * 100) / 100,
                averageDuration: processedCampaign.average_duration ? Math.round(processedCampaign.average_duration) : 0,
                accuracy: 95,
                clarity: 88,
                engagement: 92,
                adherenceToScript: 96,
                sentimentScore: 7.8,
                averageCallQuality: 92,
                positiveResponseRate: 45,
                negativeResponseRate: 15,
                averageResponseTime: '8.5s',
                commonKeywords: [
                    { word: 'interested', count: 145 },
                    { word: 'pricing', count: 98 },
                    { word: 'features', count: 76 },
                    { word: 'consider', count: 65 }
                ]
            };

            return [processedCampaign];
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
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
        
        // Process and return campaigns with proper JSON parsing
        return campaigns.map(campaign => {
            const processedCampaign = {};
            
            // Convert each field from Buffer if needed and parse JSON fields
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
        try {
            console.log('Updating campaign status:', { id, status, companyId });
            const query = `
                UPDATE voice_campaigns 
                SET status = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? 
                AND company_id = ?
                AND is_active = TRUE
            `;
            const [result] = await db.query(query, [status, id, companyId]);
            console.log('Update status result:', result);
            return result;
        } catch (error) {
            console.error('Error in updateStatus:', error);
            throw error;
        }
    }

    static async startCampaign(id, companyId) {
        try {
            // First check if the campaign exists and belongs to the company
            const [existingCampaign] = await db.query(
                'SELECT status FROM voice_campaigns WHERE id = ? AND company_id = ? AND is_active = TRUE',
                [id, companyId]
            );

            if (!existingCampaign || existingCampaign.length === 0) {
                throw new Error('Campaign not found or unauthorized');
            }

            // Check if the campaign is in a valid state to be started
            const currentStatus = existingCampaign[0].status;
            if (currentStatus === 'completed') {
                throw new Error('Cannot start a completed campaign');
            }
            if (currentStatus === 'active') {
                throw new Error('Campaign is already running');
            }

            // Update the campaign status to active
            const result = await this.updateStatus(id, 'active', companyId);
            
            if (!result || !result.campaign) {
                throw new Error('Failed to start campaign');
            }

            // TODO: Add any additional start logic here (e.g., initiating call queue)
            
            return result;
        } catch (error) {
            console.error('Error in startCampaign:', error);
            throw error;
        }
    }

    static async pauseCampaign(id, companyId) {
        const campaign = await this.updateStatus(id, 'paused', companyId);
        // TODO: Add any additional pause logic here (e.g., pausing call queue)
        return campaign;
    }

    static async resumeCampaign(id, companyId) {
        const campaign = await this.updateStatus(id, 'active', companyId);
        // TODO: Add any additional resume logic here (e.g., resuming call queue)
        return campaign;
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

    static async getPendingLeads(campaignId, companyId) {
        try {
            console.log('Getting pending leads:', { campaignId, companyId });
            const query = `
                SELECT vl.id, vl.phone, vl.status
                FROM voice_leads vl
                JOIN voice_campaigns vc ON vl.campaign_id = vc.id
                WHERE vl.campaign_id = ?
                AND vl.company_id = ?
                AND vl.status IN ('pending', 'failed', 'error', 'no_answer', 'busy', 'cancelled')
                AND vc.status = 'active'
                AND vc.is_active = TRUE
            `;
            const [leads] = await db.query(query, [campaignId, companyId]);
            console.log('Found leads:', leads);
            return leads;
        } catch (error) {
            console.error('Error in getPendingLeads:', error);
            throw error;
        }
    }

    static async initiateSequentialCalls(campaignId, companyId, leads) {
        try {
            if (!leads || leads.length === 0) {
                return [];
            }

            // Fetch Twilio configuration
            const twilioConfig = await TwilioConfig.findOne({ 
                where: { company_id: companyId } 
            });

            if (!twilioConfig) {
                throw new Error('Twilio configuration not found');
            }
            const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
            const callResults = [];

            // Function to check campaign status
            const checkCampaignStatus = async () => {
                const [campaign] = await db.query(
                    'SELECT status FROM voice_campaigns WHERE id = ? AND company_id = ?',
                    [campaignId, companyId]
                );
                return campaign && campaign[0] && campaign[0].status === 'active';
            };

            // Function to initiate a call and process sequentially
            const initiateSequentialCall = async (index) => {
                if (index >= leads.length) {
                    return callResults;
                }

                // Check if campaign is still active
                const isActive = await checkCampaignStatus();
                if (!isActive) {
                    console.log('Campaign is no longer active, stopping further calls');
                    return callResults;
                }

                const lead = leads[index];
                
                try {
                    // Create Ultravox Call
                    const { joinUrl } = await this.createUltravoxCall(companyId);

                    // Initiate Twilio Call
                    const call = await client.calls.create({
                        twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
                        to: lead.phone,
                        from: twilioConfig.phone_number
                    });

                    // Update lead status
                    await db.query(
                        'UPDATE voice_leads SET status = ?, call_sid = ? WHERE id = ?',
                        ['in_progress', call.sid, lead.id]
                    );

                    // Track call result
                    callResults.push({
                        leadId: lead.id,
                        phoneNumber: lead.phone,
                        status: 'initiated',
                        callSid: call.sid,
                        joinUrl
                    });

                    // Check call status and proceed to next call
                    return new Promise((resolve, reject) => {
                        const checkCallStatus = async () => {
                            try {
                                // Check if campaign is still active before checking call status
                                const isStillActive = await checkCampaignStatus();
                                if (!isStillActive) {
                                    console.log('Campaign is no longer active during call status check');
                                    callResults[index].status = 'cancelled';
                                    await db.query(
                                        'UPDATE voice_leads SET status = ? WHERE id = ?',
                                        ['cancelled', lead.id]
                                    );
                                    resolve(callResults);
                                    return;
                                }

                                const fetchedCall = await client.calls(call.sid).fetch();
                                const updateStatusAndProceed = async (status) => {
                                    callResults[index].status = status;
                                    await db.query(
                                        'UPDATE voice_leads SET status = ? WHERE id = ?',
                                        [status, lead.id]
                                    );
                                    resolve(initiateSequentialCall(index + 1));
                                };

                                switch (fetchedCall.status) {
                                    case 'completed':
                                        console.log(`Call to ${lead.phone} completed.`);
                                        await updateStatusAndProceed('completed');
                                        break;
                                    case 'busy':
                                        console.log(`Call to ${lead.phone} failed, recipient's line is busy.`);
                                        await updateStatusAndProceed('busy');
                                        break;
                                    case 'failed':
                                        console.log(`Call to ${lead.phone} failed.`);
                                        await updateStatusAndProceed('failed');
                                        break;
                                    case 'no-answer':
                                        console.log(`Call to ${lead.phone} was not answered.`);
                                        await updateStatusAndProceed('no_answer');
                                        break;
                                    case 'cancelled':
                                        console.log(`Call to ${lead.phone} was cancelled.`);
                                        await updateStatusAndProceed('cancelled');
                                        break;
                                    default:
                                        console.log(`Call to ${lead.phone} is still in progress...`);
                                        setTimeout(checkCallStatus, 5000);
                                }
                            } catch (error) {
                                console.error(`Error checking call status: ${error.message}`);
                                callResults[index].status = 'error';
                                await db.query(
                                    'UPDATE voice_leads SET status = ? WHERE id = ?',
                                    ['error', lead.id]
                                );
                                resolve(initiateSequentialCall(index + 1));
                            }
                        };

                        setTimeout(checkCallStatus, 5000);
                    });
                } catch (callError) {
                    console.error(`Error initiating call to ${lead.phone}:`, callError);
                    
                    await db.query(
                        'UPDATE voice_leads SET status = ? WHERE id = ?',
                        ['failed', lead.id]
                    );

                    callResults.push({
                        leadId: lead.id,
                        phoneNumber: lead.phone,
                        status: 'initiation_error',
                        error: callError.message
                    });

                    return initiateSequentialCall(index + 1);
                }
            };

            // Start sequential call processing
            await initiateSequentialCall(0);

            return callResults;
        } catch (error) {
            console.error('Error in initiateSequentialCalls:', error);
            throw error;
        }
    }

    static async createUltravoxCall(companyId) {
        try {
            // Fetch Twilio and Ultravox configurations for the specific company
            const twilioConfig = await TwilioConfig.findOne({ 
                where: { company_id: companyId } 
            });
    
            const ultravoxConfig = await UltravoxConfiguration.findOne({ 
                where: { company_id: companyId } 
            });
    
            if (!twilioConfig || !ultravoxConfig) {
                throw new Error('Configuration not found for the specified company');
            }
    
            // Log the configuration being used
            console.log('Using Ultravox config:', {
                apiurl: ultravoxConfig.apiurl,
                model: ultravoxConfig.model,
                voice: ultravoxConfig.voice,
                firstspeaker: ultravoxConfig.firstspeaker
            });

            // Prepare Ultravox Call Configuration
            const ULTRAVOX_CALL_CONFIG = {
                systemPrompt: ultravoxConfig.system_prompt || 'You are a helpful assistant',
                model: ultravoxConfig.model || 'fixie-ai/ultravox',
                voice: ultravoxConfig.voice || 'terrence',
                temperature: 0.3,
                firstSpeaker: ultravoxConfig.firstspeaker || 'FIRST_SPEAKER_USER',
                medium: { "twilio": {} }
            };
    
            // Use axios instead of https module for simpler promise handling
            const response = await axios.post(ultravoxConfig.apiurl, ULTRAVOX_CALL_CONFIG, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': ultravoxConfig.apikey
                }
            });

            console.log('Ultravox API response:', response.data);

            if (!response.data || !response.data.joinUrl) {
                console.error('Missing joinUrl in response:', response.data);
                throw new Error('Invalid response from Ultravox API - missing joinUrl');
            }

            return {
                joinUrl: response.data.joinUrl
            };
        } catch (error) {
            console.error('Error creating Ultravox call:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            throw error;
        }
    }

    static async checkCampaignStatus(campaignId, companyId) {
        try {
            const [campaign] = await db.query(
                'SELECT status FROM voice_campaigns WHERE id = ? AND company_id = ?',
                [campaignId, companyId]
            );
            return campaign && campaign[0] && campaign[0].status === 'active';
        } catch (error) {
            console.error('Error checking campaign status:', error);
            return false;
        }
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

        // Validate owner_id if provided
        if (data.owner_id && typeof data.owner_id !== 'number') {
            throw new Error('owner_id must be a number');
        }

        // Validate team_members if provided
        if (data.team_members) {
            if (!Array.isArray(data.team_members)) {
                throw new Error('team_members must be an array');
            }
            
            if (data.team_members.some(id => typeof id !== 'number')) {
                throw new Error('All team member IDs must be numbers');
            }
        }
        
        // Validate tags if provided
        if (data.tags && !Array.isArray(data.tags)) {
            throw new Error('tags must be an array');
        }

        if (!data.company_id || typeof data.company_id !== 'number') {
            throw new Error('Invalid company_id');
        }

        return true;
    }

    static async updateLeadStatus(leadId, status) {
        try {
            const query = 'UPDATE voice_leads SET status = ? WHERE id = ?';
            const params = [status, leadId];

            const [result] = await db.query(query, params);
            return result;
        } catch (error) {
            console.error('Error updating lead status:', error);
            throw error;
        }
    }
}

module.exports = VoiceCampaign; 
