const express = require('express');
const router = express.Router();
const CallCampaign = require('../models/CallCampaign');

// Create a new call campaign
router.post('/', async (req, res) => {
	try {
		const result = await CallCampaign.create(req.body);
		res.status(201).json({ message: 'Call campaign created successfully', data: result });
	} catch (error) {
		res.status(500).json({ message: 'Error creating call campaign', error: error.message });
	}
});

// Get all call campaigns
router.get('/', async (req, res) => {
	try {
		const campaigns = await CallCampaign.findAll(req.query);
		res.json(campaigns);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call campaigns', error: error.message });
	}
});

// Get a specific call campaign by ID
router.get('/:campaignId', async (req, res) => {
	try {
		const campaign = await CallCampaign.findById(req.params.campaignId);
		if (!campaign || campaign.length === 0) {
			return res.status(404).json({ message: 'Call campaign not found' });
		}
		res.json(campaign[0]);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call campaign', error: error.message });
	}
});

// Update a call campaign
router.put('/:campaignId', async (req, res) => {
	try {
		const result = await CallCampaign.update(req.params.campaignId, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call campaign not found' });
		}
		res.json({ message: 'Call campaign updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call campaign', error: error.message });
	}
});

// Delete a call campaign
router.delete('/:campaignId', async (req, res) => {
	try {
		const result = await CallCampaign.delete(req.params.campaignId);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call campaign not found' });
		}
		res.json({ message: 'Call campaign deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting call campaign', error: error.message });
	}
});

// Update the status of a call campaign
router.put('/:campaignId/status', async (req, res) => {
	try {
		const result = await CallCampaign.updateStatus(req.params.campaignId, req.body.status);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call campaign not found' });
		}
		res.json({ message: 'Call campaign status updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call campaign status', error: error.message });
	}
});

// Toggle the active status of a call campaign
router.put('/:campaignId/active', async (req, res) => {
	try {
		const result = await CallCampaign.toggleActive(req.params.campaignId, req.body.is_active);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call campaign not found' });
		}
		res.json({ message: 'Call campaign active status updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call campaign active status', error: error.message });
	}
});

module.exports = router;