const express = require('express');
const router = express.Router();
const VoiceCampaign = require('../models/VoiceCampaign');
const twilio = require('twilio');
const https = require('https');

const TwilioConfig = require('../models/TwilioConfig');
const UltravoxConfiguration = require('../models/UltravoxConfiguration');

async function createUltravoxCall(companyId) {
    try {
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        const ultravoxConfig = await UltravoxConfiguration.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig || !ultravoxConfig) {
            throw new Error('Configuration not found for the specified company');
        }

        const ULTRAVOX_CALL_CONFIG = {
            systemPrompt: ultravoxConfig.system_prompt,
            model: ultravoxConfig.model,
            voice: ultravoxConfig.voice,
            temperature: 0.3,
            firstSpeaker: ultravoxConfig.firstspeaker,
            medium: { "twilio": {} }
        };

        const request = https.request(ultravoxConfig.apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': ultravoxConfig.apikey
            }
        });

        const response = await new Promise((resolve, reject) => {
            let data = '';

            request.on('response', (response) => {
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });

            request.on('error', reject);
            request.write(JSON.stringify(ULTRAVOX_CALL_CONFIG));
            request.end();
        });

        return response;

    } catch (error) {
        console.error('Error creating Ultravox call:', error);
        throw error;
    }
}

router.post('/', async (req, res) => {
    try {
        await VoiceCampaign.validateCampaignData(req.body);
        const { insertId, campaign } = await VoiceCampaign.create(req.body);
        res.status(201).json({ 
            message: 'Voice campaign created successfully', 
            data: campaign
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating voice campaign', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const campaigns = await VoiceCampaign.findAll(req.query);
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching voice campaigns', error: error.message });
    }
});

router.get('/company/:companyId', async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);
        if (isNaN(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID' });
        }

        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            search: req.query.search,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            sort: req.query.sort,
            order: req.query.order,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        };

        const result = await VoiceCampaign.findByCompany(companyId, filters);
        res.json(result);
    } catch (error) {
        console.error('Error in get company campaigns:', error);
        res.status(500).json({ 
            message: 'Error fetching company voice campaigns', 
            error: error.message 
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);
        
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        const campaignData = campaign[0];
        const { metrics, ...campaignDetails } = campaignData;

        res.json({
            message: 'Campaign fetched successfully',
            data: {
                id: campaignDetails.id,
                name: campaignDetails.name,
                description: campaignDetails.description,
                status: campaignDetails.status,
                company_id: campaignDetails.company_id,
                voice_type: campaignDetails.voice_type,
                script: campaignDetails.script,
                working_days: campaignDetails.working_days,
                call_start_time: campaignDetails.call_start_time,
                call_end_time: campaignDetails.call_end_time,
                team_members: campaignDetails.team_members,
                tags: campaignDetails.tags,
                created_at: campaignDetails.created_at,
                updated_at: campaignDetails.updated_at,
                owner_id: campaignDetails.owner_id,
                call_attempts: campaignDetails.call_attempts,
                retry_interval: campaignDetails.retry_interval,
                max_call_duration: campaignDetails.max_call_duration,
                enable_transcription: campaignDetails.enable_transcription,
                enable_recording: campaignDetails.enable_recording,
                leads: {
                    total: metrics.totalLeads,
                    completed: metrics.completedCalls,
                    successful: metrics.successfulCalls,
                    failed: metrics.failedCalls,
                    noAnswer: metrics.noAnswerCalls,
                    successRate: metrics.successRate,
                    averageDuration: metrics.averageDuration
                },
                metrics: {
                    accuracy: metrics.accuracy,
                    clarity: metrics.clarity,
                    engagement: metrics.engagement,
                    adherenceToScript: metrics.adherenceToScript,
                    sentimentScore: metrics.sentimentScore,
                    averageCallQuality: metrics.averageCallQuality,
                    positiveResponseRate: metrics.positiveResponseRate,
                    negativeResponseRate: metrics.negativeResponseRate,
                    averageResponseTime: metrics.averageResponseTime,
                    commonKeywords: metrics.commonKeywords
                }
            }
        });
    } catch (error) {
        console.error('Error fetching campaign:', error);
        res.status(500).json({ 
            message: 'Error fetching voice campaign', 
            error: error.message 
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await VoiceCampaign.validateCampaignData(req.body);
        const result = await VoiceCampaign.update(req.params.id, req.body, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }
        res.json({ message: 'Voice campaign updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating voice campaign', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await VoiceCampaign.delete(req.params.id, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }
        res.json({ message: 'Voice campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting voice campaign', error: error.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['draft', 'active', 'paused', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const result = await VoiceCampaign.updateStatus(req.params.id, status, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }
        res.json({ message: 'Campaign status updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating campaign status', error: error.message });
    }
});

router.get('/:id/stats', async (req, res) => {
    try {
        const stats = await VoiceCampaign.getStats(req.params.id, req.user.company_id);
        if (!stats || stats.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign statistics', error: error.message });
    }
});

router.post('/:id/start', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);

        console.log('Starting campaign:', { campaignId, companyId });

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        const result = await VoiceCampaign.updateStatus(campaignId, 'active', companyId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Failed to update campaign status' });
        }

        console.log('Campaign status updated to active');

        const pendingLeads = await VoiceCampaign.getPendingLeads(campaignId, companyId);
        console.log('Fetched pending leads:', pendingLeads);

        if (!pendingLeads || pendingLeads.length === 0) {
            return res.status(400).json({ message: 'No pending leads found for this campaign' });
        }

        res.json({ 
            message: 'Campaign started successfully',
            data: campaign[0],
            pendingLeads: pendingLeads,
            totalCalls: pendingLeads.length
        });

        try {
            // Get Twilio config once before starting calls
            const twilioConfig = await TwilioConfig.findOne({ 
                where: { company_id: companyId } 
            });

            if (!twilioConfig) {
                throw new Error('Twilio configuration not found');
            }

            const initiateSequentialCall = async (index) => {
                if (index >= pendingLeads.length) {
                    console.log('All calls completed, total calls:', pendingLeads.length);
                    return callResults;
                }

                // Check if campaign is still active using the model method
                const isActive = await VoiceCampaign.checkCampaignStatus(campaignId, companyId);
                if (!isActive) {
                    console.log('Campaign is no longer active, stopping further calls');
                    return callResults;
                }

                const phoneNumber = pendingLeads[index];
                
                try {
                    const callDetails = await createUltravoxCall(companyId);
                    console.log('Call ID:', callDetails.callId);
                    console.log('Join URL:', callDetails.joinUrl);

                    const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
                    const call = await client.calls.create({
                        twiml: `<Response><Connect><Stream url="${callDetails.joinUrl}"/></Connect></Response>`,
                        to: phoneNumber.phone,
                        from: twilioConfig.phone_number
                    });

                    // Track call result and update lead status
                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'initiated', call.sid);

                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        leadId: phoneNumber.id,
                        status: 'initiated',
                        callSid: call.sid,
                        callId: callDetails.callId,
                        joinUrl: callDetails.joinUrl
                    });

                    return new Promise((resolve) => {
                        const checkCallStatus = async () => {
                            try {
                                // Check if campaign is still active using the model method
                                const isStillActive = await VoiceCampaign.checkCampaignStatus(campaignId, companyId);
                                if (!isStillActive) {
                                    console.log('Campaign is no longer active during call status check');
                                    callResults[index].status = 'cancelled';
                                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'cancelled');
                                    resolve(callResults);
                                    return;
                                }

                                const fetchedCall = await client.calls(call.sid).fetch();
                                const updateStatusAndProceed = async (status) => {
                                    console.log(`Updating status for lead ${phoneNumber.id} to ${status}`);
                                    callResults[index].status = status;
                                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, status);
                                    
                                    // If this is the last call, resolve with results
                                    if (index === pendingLeads.length - 1) {
                                        console.log('Last call completed, resolving with results');
                                        resolve(callResults);
                                    } else {
                                        // If not the last call, proceed to next
                                        resolve(initiateSequentialCall(index + 1));
                                    }
                                };

                                if (fetchedCall.status === 'completed') {
                                    console.log(`Call to ${fetchedCall.to} completed.`);
                                    await updateStatusAndProceed('completed');
                                } else if (fetchedCall.status === 'busy') {
                                    console.log(`Call to ${fetchedCall.to} failed, recipient's line is busy.`);
                                    await updateStatusAndProceed('busy');
                                } else if (fetchedCall.status === 'failed') {
                                    console.log(`Call to ${fetchedCall.to} failed.`);
                                    await updateStatusAndProceed('failed');
                                } else if (fetchedCall.status === 'no-answer') {
                                    console.log(`Call to ${fetchedCall.to} was not answered.`);
                                    await updateStatusAndProceed('no-answer');
                                } else if (fetchedCall.status === 'cancelled') {
                                    console.log(`Call to ${fetchedCall.to} was cancelled.`);
                                    await updateStatusAndProceed('cancelled');
                                } else {
                                    console.log(`Call to ${fetchedCall.to} is still in progress...`);
                                    setTimeout(checkCallStatus, 5000);
                                }
                            } catch (error) {
                                console.error(`Error checking call status: ${error.message}`);
                                callResults[index].status = 'error';
                                await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'failed');
                                
                                // If this is the last call, resolve with results
                                if (index === pendingLeads.length - 1) {
                                    console.log('Last call failed, resolving with results');
                                    resolve(callResults);
                                } else {
                                    resolve(initiateSequentialCall(index + 1));
                                }
                            }
                        };

                        setTimeout(checkCallStatus, 5000);
                    });
                } catch (callError) {
                    console.error(`Error initiating call to ${phoneNumber.phone}:`, callError);
                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'failed');
                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        leadId: phoneNumber.id,
                        status: 'initiation_error',
                        error: callError.message
                    });
                    
                    // If this is the last call, return results
                    if (index === pendingLeads.length - 1) {
                        console.log('Last call failed during initiation, returning results');
                        return callResults;
                    }
                    return initiateSequentialCall(index + 1);
                }
            };

            const callResults = [];
            await initiateSequentialCall(0);
        } catch (error) {
            console.error('Error processing bulk calls:', error);
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error('Error starting campaign:', error);
        res.status(400).json({ 
            message: 'Error starting campaign', 
            error: error.message,
            details: error.stack 
        });
    }
});

router.post('/:id/pause', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const result = await VoiceCampaign.updateStatus(campaignId, 'paused', companyId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        res.json({ 
            message: 'Campaign paused successfully',
            data: campaign[0]
        });
    } catch (error) {
        console.error('Error pausing campaign:', error);
        res.status(400).json({ message: 'Error pausing campaign', error: error.message });
    }
});

router.post('/:id/resume', async (req, res) => {

    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);

        console.log('Starting campaign:', { campaignId, companyId });

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        const result = await VoiceCampaign.updateStatus(campaignId, 'active', companyId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Failed to update campaign status' });
        }

        console.log('Campaign status updated to active');

        const pendingLeads = await VoiceCampaign.getPendingLeads(campaignId, companyId);
        console.log('Fetched pending leads:', pendingLeads);

        if (!pendingLeads || pendingLeads.length === 0) {
            return res.status(400).json({ message: 'No pending leads found for this campaign' });
        }

        res.json({ 
            message: 'Campaign started successfully',
            data: campaign[0],
            pendingLeads: pendingLeads,
            totalCalls: pendingLeads.length
        });

        try {
            // Get Twilio config once before starting calls
            const twilioConfig = await TwilioConfig.findOne({ 
                where: { company_id: companyId } 
            });

            if (!twilioConfig) {
                throw new Error('Twilio configuration not found');
            }

            const initiateSequentialCall = async (index) => {
                if (index >= pendingLeads.length) {
                    console.log('All calls completed, total calls:', pendingLeads.length);
                    return callResults;
                }

                // Check if campaign is still active using the model method
                const isActive = await VoiceCampaign.checkCampaignStatus(campaignId, companyId);
                if (!isActive) {
                    console.log('Campaign is no longer active, stopping further calls');
                    return callResults;
                }

                const phoneNumber = pendingLeads[index];
                
                try {
                    const callDetails = await createUltravoxCall(companyId);
                    console.log('Call ID:', callDetails.callId);
                    console.log('Join URL:', callDetails.joinUrl);

                    const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
                    const call = await client.calls.create({
                        twiml: `<Response><Connect><Stream url="${callDetails.joinUrl}"/></Connect></Response>`,
                        to: phoneNumber.phone,
                        from: twilioConfig.phone_number
                    });

                    // Track call result and update lead status
                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'initiated', call.sid);

                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        leadId: phoneNumber.id,
                        status: 'initiated',
                        callSid: call.sid,
                        callId: callDetails.callId,
                        joinUrl: callDetails.joinUrl
                    });

                    return new Promise((resolve) => {
                        const checkCallStatus = async () => {
                            try {
                                // Check if campaign is still active using the model method
                                const isStillActive = await VoiceCampaign.checkCampaignStatus(campaignId, companyId);
                                if (!isStillActive) {
                                    console.log('Campaign is no longer active during call status check');
                                    callResults[index].status = 'cancelled';
                                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'cancelled');
                                    resolve(callResults);
                                    return;
                                }

                                const fetchedCall = await client.calls(call.sid).fetch();
                                const updateStatusAndProceed = async (status) => {
                                    console.log(`Updating status for lead ${phoneNumber.id} to ${status}`);
                                    callResults[index].status = status;
                                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, status);
                                    
                                    // If this is the last call, resolve with results
                                    if (index === pendingLeads.length - 1) {
                                        console.log('Last call completed, resolving with results');
                                        resolve(callResults);
                                    } else {
                                        // If not the last call, proceed to next
                                        resolve(initiateSequentialCall(index + 1));
                                    }
                                };

                                if (fetchedCall.status === 'completed') {
                                    console.log(`Call to ${fetchedCall.to} completed.`);
                                    await updateStatusAndProceed('completed');
                                } else if (fetchedCall.status === 'busy') {
                                    console.log(`Call to ${fetchedCall.to} failed, recipient's line is busy.`);
                                    await updateStatusAndProceed('busy');
                                } else if (fetchedCall.status === 'failed') {
                                    console.log(`Call to ${fetchedCall.to} failed.`);
                                    await updateStatusAndProceed('failed');
                                } else if (fetchedCall.status === 'no-answer') {
                                    console.log(`Call to ${fetchedCall.to} was not answered.`);
                                    await updateStatusAndProceed('no-answer');
                                } else if (fetchedCall.status === 'cancelled') {
                                    console.log(`Call to ${fetchedCall.to} was cancelled.`);
                                    await updateStatusAndProceed('cancelled');
                                } else {
                                    console.log(`Call to ${fetchedCall.to} is still in progress...`);
                                    setTimeout(checkCallStatus, 5000);
                                }
                            } catch (error) {
                                console.error(`Error checking call status: ${error.message}`);
                                callResults[index].status = 'error';
                                await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'failed');
                                
                                // If this is the last call, resolve with results
                                if (index === pendingLeads.length - 1) {
                                    console.log('Last call failed, resolving with results');
                                    resolve(callResults);
                                } else {
                                    resolve(initiateSequentialCall(index + 1));
                                }
                            }
                        };

                        setTimeout(checkCallStatus, 5000);
                    });
                } catch (callError) {
                    console.error(`Error initiating call to ${phoneNumber.phone}:`, callError);
                    await VoiceCampaign.updateLeadStatus(phoneNumber.id, 'failed');
                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        leadId: phoneNumber.id,
                        status: 'initiation_error',
                        error: callError.message
                    });
                    
                    // If this is the last call, return results
                    if (index === pendingLeads.length - 1) {
                        console.log('Last call failed during initiation, returning results');
                        return callResults;
                    }
                    return initiateSequentialCall(index + 1);
                }
            };

            const callResults = [];
            await initiateSequentialCall(0);
        } catch (error) {
            console.error('Error processing bulk calls:', error);
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        console.error('Error starting campaign:', error);
        res.status(400).json({ 
            message: 'Error starting campaign', 
            error: error.message,
            details: error.stack 
        });
    }
});

router.post('/:id/complete', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.body.company_id || (req.user && req.user.company_id);
        
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const updateResult = await VoiceCampaign.updateStatus(campaignId, 'completed', companyId);
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Campaign not found or unauthorized' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Campaign not found after update' });
        }

        res.json({
            message: 'Campaign completed successfully',
            data: {
                ...campaign[0],
                metrics: {
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
                }
            }
        });
    } catch (error) {
        console.error('Error completing campaign:', error);
        res.status(500).json({
            message: 'Error completing campaign',
            error: error.message
        });
    }
});

router.post('/call-status', async (req, res) => {
    try {
        const { CallSid, CallStatus } = req.body;
        console.log('Received call status update:', { CallSid, CallStatus });

        let status = CallStatus.toLowerCase();
        if (status === 'in-progress') status = 'in_progress';
        if (status === 'no-answer') status = 'no_answer';

        const [leads] = await db.query(
            'UPDATE voice_leads SET status = ? WHERE call_sid = ?',
            [status, CallSid]
        );

        if (leads.affectedRows === 0) {
            console.warn('No lead found for call SID:', CallSid);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error handling call status:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
