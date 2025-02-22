const express = require('express');
const router = express.Router();
const VoiceCampaign = require('../models/VoiceCampaign');
const twilio = require('twilio');
const https = require('https');

const TwilioConfig = require('../models/TwilioConfig');
const UltravoxConfiguration = require('../models/UltravoxConfiguration');







async function createUltravoxCall(companyId) {
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

        // Prepare Ultravox Call Configuration
        const ULTRAVOX_CALL_CONFIG = {
            systemPrompt: ultravoxConfig.system_prompt,
            model: ultravoxConfig.model,
            voice: ultravoxConfig.voice,
            temperature: 0.3,
            firstSpeaker: ultravoxConfig.firstspeaker,
            medium: { "twilio": {} }
        };

        // Create Ultravox Call
        const request = https.request(ultravoxConfig.apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': ultravoxConfig.apikey
            }
        });

        return new Promise((resolve, reject) => {
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
    } catch (error) {
        console.error('Error creating Ultravox call:', error);
        throw error;
    }
}




// Create a new voice campaign
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

// Get all voice campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await VoiceCampaign.findAll(req.query);
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching voice campaigns', error: error.message });
    }
});

// Get voice campaigns by company
router.get('/company/:companyId', async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);
        if (isNaN(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID' });
        }

        // Extract query parameters
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

// Get a specific voice campaign by ID and company ID
router.get('/:id', async (req, res) => {
    try {
        const campaignId = req.params.id;
        // Get company_id from query params, auth token, or request body
        const companyId = req.query.company_id || (req.user && req.user.company_id);
        
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        // Extract the campaign data and format the response
        const campaignData = campaign[0];
        const { metrics, ...campaignDetails } = campaignData;

        // Return success response with campaign data and metrics
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

// Update a voice campaign
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

// Delete a voice campaign
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

// Update campaign status
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

// Get campaign statistics
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

// Start a campaign
router.post('/:id/start', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);

        console.log('Starting campaign:', { campaignId, companyId });

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        // First check if campaign exists
        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        // Update campaign status
        const result = await VoiceCampaign.updateStatus(campaignId, 'active', companyId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Failed to update campaign status' });
        }

        console.log('Campaign status updated to active');

        // Fetch pending leads
        const pendingLeads = await VoiceCampaign.getPendingLeads(campaignId, companyId);
        console.log('Fetched pending leads:', pendingLeads);

        if (!pendingLeads || pendingLeads.length === 0) {
            return res.status(400).json({ message: 'No pending leads found for this campaign' });
        }

        // Send immediate success response
        res.json({ 
            message: 'Campaign started successfully',
            data: campaign[0],
            pendingLeads: pendingLeads,
            totalCalls: pendingLeads.length
        });

        // Start making calls in the background
        // VoiceCampaign.initiateSequentialCalls(campaignId, companyId, pendingLeads)
        //     .then(callResults => {
        //         console.log('Calls completed:', callResults);
        //     })
        //     .catch(async error => {
        //         console.error('Error making calls:', error);
        //         // If calls fail, revert campaign status to draft
        //         try {
        //             await VoiceCampaign.updateStatus(campaignId, 'draft', companyId);
        //             console.log('Campaign status reverted to draft due to call errors');
        //         } catch (revertError) {
        //             console.error('Error reverting campaign status:', revertError);
        //         }
        //     });


        try {
            // const { 
            //     companyId, 
            //     phoneNumbers, 
            //     twimlUrl = 'http://demo.twilio.com/docs/voice.xml' 
            // } = req.body;
    
            if (!companyId) {
                return res.status(400).json({ error: 'Company ID is required' });
            }
    
            // if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            //     return res.status(400).json({ error: 'Phone numbers array is required and must not be empty' });
            // }
    
            // Fetch Twilio configuration
            const twilioConfig = await TwilioConfig.findOne({ 
                where: { company_id: companyId } 
            });
    
            if (!twilioConfig) {
                return res.status(404).json({ error: 'Twilio configuration not found' });
            }
    
            // Initialize call results tracking
            const callResults = [];
            const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
    
            // Function to initiate a call and process sequentially
            const initiateSequentialCall = async (index) => {
                
                if (index >= pendingLeads.length) {
                    return callResults;
                }
    
                const phoneNumber = pendingLeads[index];
                
                try {
                    // Create Ultravox Call
                    const { joinUrl } = await createUltravoxCall(companyId);
    
                    // Initiate Twilio Call
                    const call = await client.calls.create({
    
                        twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
                        to: phoneNumber.phone,
                        from: twilioConfig.phone_number
    
                    });
    
                    // Track call result
                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        status: 'initiated',
                        callSid: call.sid,
                        joinUrl
                    });
    
                    // Check call status and proceed to next call
                    return new Promise((resolve, reject) => {
                        const checkCallStatus = () => {
                            client.calls(call.sid)
                                .fetch()
                                .then((fetchedCall) => {
                                    if (fetchedCall.status === 'completed') {
                                        console.log(`Call to ${fetchedCall.to} completed.`);
                                        callResults[index].status = 'completed';
                                        resolve(initiateSequentialCall(index + 1));
                                    } else if (fetchedCall.status === 'busy') {
                                        console.log(`Call to ${fetchedCall.to} failed, recipient's line is busy.`);
                                        callResults[index].status = 'busy';
                                        resolve(initiateSequentialCall(index + 1));
                                    } else if (fetchedCall.status === 'failed') {
                                        console.log(`Call to ${fetchedCall.to} failed.`);
                                        callResults[index].status = 'failed';
                                        resolve(initiateSequentialCall(index + 1));
                                    } else if (fetchedCall.status === 'no-answer') {
                                        console.log(`Call to ${fetchedCall.to} was not answered.`);
                                        callResults[index].status = 'no-answer';
                                        resolve(initiateSequentialCall(index + 1));
                                    } else if (fetchedCall.status === 'cancelled') {
                                        console.log(`Call to ${fetchedCall.to} was cancelled, possibly hung up.`);
                                        callResults[index].status = 'cancelled';
                                        resolve(initiateSequentialCall(index + 1));
                                    } else {
                                        console.log(`Call to ${fetchedCall.to} is still in progress...`);
                                        setTimeout(checkCallStatus, 5000); // Check every 5 seconds
                                    }
                                })
                                .catch((error) => {
                                    console.error(`Error fetching call status: ${error.message}`);
                                    callResults[index].status = 'error';
                                    callResults[index].error = error.message;
                                    resolve(initiateSequentialCall(index + 1));
                                });
                        };
    
                        setTimeout(checkCallStatus, 5000);
                    });
                
                } catch (callError) {
                    // Handle call initiation error
                    callResults.push({
                        phoneNumber: phoneNumber.phone,
                        status: 'initiation_error',
                        error: callError.message
                    });
    
                    return initiateSequentialCall(index + 1);
                }
            };
    
            // Start sequential call processing
            await initiateSequentialCall(0);
    
            // res.status(200).json({ 
            //     message: 'Bulk calls processed sequentially', 
            //     totalCalls: phoneNumbers.length,
            //     callResults 
            // });
    
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

// Pause a campaign
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

        // Fetch updated campaign data
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

// Resume a campaign
router.post('/:id/resume', async (req, res) => {
    try {
        const campaignId = req.params.id;
        const companyId = req.query.company_id || (req.user && req.user.company_id);

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const result = await VoiceCampaign.updateStatus(campaignId, 'active', companyId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }

        // Fetch updated campaign data
        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        res.json({ 
            message: 'Campaign resumed successfully',
            data: campaign[0]
        });
    } catch (error) {
        console.error('Error resuming campaign:', error);
        res.status(400).json({ message: 'Error resuming campaign', error: error.message });
    }
});

// Complete a campaign
router.post('/:id/complete', async (req, res) => {
    try {
        const campaignId = req.params.id;
        // Get company_id from auth token or request body
        const companyId = req.body.company_id || (req.user && req.user.company_id);
        
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        // First update the campaign status
        const updateResult = await VoiceCampaign.updateStatus(campaignId, 'completed', companyId);
        
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Campaign not found or unauthorized' });
        }

        // Fetch the updated campaign data
        const campaign = await VoiceCampaign.findById(campaignId, companyId);
        
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Campaign not found after update' });
        }

        // Return success response with updated campaign data
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

// Handle Twilio call status callbacks
router.post('/call-status', async (req, res) => {
    try {
        const { CallSid, CallStatus } = req.body;
        console.log('Received call status update:', { CallSid, CallStatus });

        // Map Twilio status to our status
        let status = CallStatus.toLowerCase();
        if (status === 'in-progress') status = 'in_progress';
        if (status === 'no-answer') status = 'no_answer';

        // Update lead status
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
