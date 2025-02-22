const express = require('express');
const router = express.Router();
const VoiceCampaign = require('../models/VoiceCampaign');

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
            message: 'Campaign started successfully',
            data: campaign[0]
        });
    } catch (error) {
        console.error('Error starting campaign:', error);
        res.status(400).json({ message: 'Error starting campaign', error: error.message });
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

module.exports = router;
