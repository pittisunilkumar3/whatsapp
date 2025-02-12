const express = require('express');
const router = express.Router();
const CallLead = require('../models/CallLead');

// Create a new call lead
router.post('/', async (req, res) => {
	try {
		const result = await CallLead.create(req.body);
		res.status(201).json({ message: 'Call lead created successfully', data: result });
	} catch (error) {
		res.status(500).json({ message: 'Error creating call lead', error: error.message });
	}
});

// Get all call leads
router.get('/', async (req, res) => {
	try {
		const leads = await CallLead.findAll(req.query);
		res.json(leads);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call leads', error: error.message });
	}
});

// Get a specific call lead by ID
router.get('/:leadId', async (req, res) => {
	try {
		const lead = await CallLead.findById(req.params.leadId);
		if (!lead || lead.length === 0) {
			return res.status(404).json({ message: 'Call lead not found' });
		}
		res.json(lead[0]);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call lead', error: error.message });
	}
});

// Get leads by company
router.get('/company/:companyId', async (req, res) => {
	try {
		const leads = await CallLead.findByCompany(req.params.companyId);
		res.json(leads);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching company leads', error: error.message });
	}
});

// Get leads by campaign
router.get('/campaign/:campaignId', async (req, res) => {
	try {
		const leads = await CallLead.findByCampaign(req.params.campaignId);
		res.json(leads);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching campaign leads', error: error.message });
	}
});

// Update a call lead
router.put('/:leadId', async (req, res) => {
	try {
		const result = await CallLead.update(req.params.leadId, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call lead not found' });
		}
		res.json({ message: 'Call lead updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call lead', error: error.message });
	}
});

// Delete a call lead
router.delete('/:leadId', async (req, res) => {
	try {
		const result = await CallLead.delete(req.params.leadId);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call lead not found' });
		}
		res.json({ message: 'Call lead deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting call lead', error: error.message });
	}
});

// Update lead status
router.put('/:leadId/status', async (req, res) => {
	try {
		const result = await CallLead.updateStatus(req.params.leadId, req.body.status);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call lead not found' });
		}
		res.json({ message: 'Call lead status updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call lead status', error: error.message });
	}
});

// Update lead score
router.put('/:leadId/score', async (req, res) => {
	try {
		const result = await CallLead.updateScore(req.params.leadId, req.body.score);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call lead not found' });
		}
		res.json({ message: 'Call lead score updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call lead score', error: error.message });
	}
});

module.exports = router;