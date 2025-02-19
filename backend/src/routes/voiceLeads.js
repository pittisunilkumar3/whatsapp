const express = require('express');
const router = express.Router();
const VoiceLead = require('../models/VoiceLead');

// Create a new lead
router.post('/', async (req, res) => {
    try {
        await VoiceLead.validateLeadData(req.body);
        const result = await VoiceLead.create(req.body);
        res.status(201).json({
            message: 'Voice lead created successfully',
            data: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating voice lead', error: error.message });
    }
});

// Get all leads for a company
router.get('/company/:companyId', async (req, res) => {
    try {
        const leads = await VoiceLead.findByCompany(req.params.companyId, req.query);
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company leads', error: error.message });
    }
});

// Get all leads for a campaign
router.get('/campaign/:campaignId', async (req, res) => {
    try {
        const leads = await VoiceLead.findByCampaign(req.params.campaignId, req.user.company_id, req.query);
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign leads', error: error.message });
    }
});

// Get a specific lead
router.get('/:id', async (req, res) => {
    try {
        const lead = await VoiceLead.findById(req.params.id, req.user.company_id);
        if (!lead || lead.length === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json(lead[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching voice lead', error: error.message });
    }
});

// Update a lead
router.put('/:id', async (req, res) => {
    try {
        await VoiceLead.validateLeadData(req.body);
        const result = await VoiceLead.update(req.params.id, req.body, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Voice lead updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating voice lead', error: error.message });
    }
});

// Delete a lead
router.delete('/:id', async (req, res) => {
    try {
        const result = await VoiceLead.delete(req.params.id, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Voice lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting voice lead', error: error.message });
    }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, sub_status } = req.body;
        if (!['pending', 'in_progress', 'completed', 'failed', 'scheduled', 'blacklisted'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const result = await VoiceLead.updateStatus(req.params.id, status, sub_status, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Lead status updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating lead status', error: error.message });
    }
});

// Assign a lead
router.patch('/:id/assign', async (req, res) => {
    try {
        const { assigned_to } = req.body;
        if (!assigned_to) {
            return res.status(400).json({ message: 'assigned_to is required' });
        }

        const result = await VoiceLead.assignLead(req.params.id, assigned_to, req.user.id, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Lead assigned successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error assigning lead', error: error.message });
    }
});

// Schedule a call
router.patch('/:id/schedule', async (req, res) => {
    try {
        const { scheduled_call_time } = req.body;
        if (!scheduled_call_time) {
            return res.status(400).json({ message: 'scheduled_call_time is required' });
        }

        const result = await VoiceLead.scheduleLead(req.params.id, scheduled_call_time, req.user.id, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Call scheduled successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error scheduling call', error: error.message });
    }
});

// Record a call attempt
router.post('/:id/call-attempt', async (req, res) => {
    try {
        const result = await VoiceLead.recordCallAttempt(req.params.id, req.body, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Call attempt recorded successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error recording call attempt', error: error.message });
    }
});

// Mark lead as converted
router.patch('/:id/convert', async (req, res) => {
    try {
        const result = await VoiceLead.markConverted(req.params.id, req.body, req.user.company_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voice lead not found' });
        }
        res.json({ message: 'Lead marked as converted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error converting lead', error: error.message });
    }
});

// Get campaign lead statistics
router.get('/campaign/:campaignId/stats', async (req, res) => {
    try {
        const stats = await VoiceLead.getLeadStats(req.params.campaignId, req.user.company_id);
        if (!stats || stats.length === 0) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead statistics', error: error.message });
    }
});

module.exports = router; 