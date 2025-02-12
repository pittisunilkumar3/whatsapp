const express = require('express');
const router = express.Router();
const Call = require('../models/Call');

// Create a new call record
router.post('/', async (req, res) => {
	try {
		const result = await Call.create(req.body);
		res.status(201).json({ message: 'Call record created successfully', data: result });
	} catch (error) {
		res.status(500).json({ message: 'Error creating call record', error: error.message });
	}
});

// Get all call records
router.get('/', async (req, res) => {
	try {
		const calls = await Call.findAll(req.query);
		res.json(calls);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call records', error: error.message });
	}
});

// Get a specific call record by ID
router.get('/:callId', async (req, res) => {
	try {
		const call = await Call.findById(req.params.callId);
		if (!call || call.length === 0) {
			return res.status(404).json({ message: 'Call record not found' });
		}
		res.json(call[0]);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call record', error: error.message });
	}
});

// Get calls by company
router.get('/company/:companyId', async (req, res) => {
	try {
		const calls = await Call.findByCompany(req.params.companyId);
		res.json(calls);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching company calls', error: error.message });
	}
});

// Get calls by agent
router.get('/agent/:agentId', async (req, res) => {
	try {
		const calls = await Call.findByAgent(req.params.agentId);
		res.json(calls);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching agent calls', error: error.message });
	}
});

// Get calls by lead
router.get('/lead/:leadId', async (req, res) => {
	try {
		const calls = await Call.findByLead(req.params.leadId);
		res.json(calls);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching lead calls', error: error.message });
	}
});

// Update a call record
router.put('/:callId', async (req, res) => {
	try {
		const result = await Call.update(req.params.callId, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call record not found' });
		}
		res.json({ message: 'Call record updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call record', error: error.message });
	}
});

// Delete a call record
router.delete('/:callId', async (req, res) => {
	try {
		const result = await Call.delete(req.params.callId);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call record not found' });
		}
		res.json({ message: 'Call record deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting call record', error: error.message });
	}
});

// Update call outcome
router.put('/:callId/outcome', async (req, res) => {
	try {
		const result = await Call.updateOutcome(req.params.callId, req.body.outcome);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call record not found' });
		}
		res.json({ message: 'Call outcome updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call outcome', error: error.message });
	}
});

// Schedule follow-up
router.put('/:callId/follow-up', async (req, res) => {
	try {
		const result = await Call.scheduleFollowUp(
			req.params.callId,
			req.body.follow_up_date,
			req.body.follow_up_time
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call record not found' });
		}
		res.json({ message: 'Follow-up scheduled successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error scheduling follow-up', error: error.message });
	}
});

module.exports = router;