const express = require('express');
const router = express.Router();
const VoiceCampaign = require('../models/VoiceCampaign');

// Create a new voice campaign
router.post('/', async (req, res) => {
    try {
        await VoiceCampaign.validateCampaignData(req.body);
        const result = await VoiceCampaign.create(req.body);
        res.status(201).json({ 
            message: 'Voice campaign created successfully', 
            data: { id: result.insertId, ...req.body }
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

// Get a specific voice campaign
router.get('/:id', async (req, res) => {
    try {
        const campaign = await VoiceCampaign.findById(req.params.id, req.user.company_id);
        if (!campaign || campaign.length === 0) {
            return res.status(404).json({ message: 'Voice campaign not found' });
        }
        res.json(campaign[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching voice campaign', error: error.message });
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

module.exports = router; 




