const express = require('express');
const router = express.Router();
const CallAgent = require('../models/CallAgent');

// Create a new call agent
router.post('/', async (req, res) => {
	try {
		const result = await CallAgent.create(req.body);
		res.status(201).json({ message: 'Call agent created successfully', data: result });
	} catch (error) {
		res.status(500).json({ message: 'Error creating call agent', error: error.message });
	}
});

// Get all call agents
router.get('/', async (req, res) => {
	try {
		const agents = await CallAgent.findAll(req.query);
		res.json(agents);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call agents', error: error.message });
	}
});

// Get a specific call agent by ID
router.get('/:agentId', async (req, res) => {
	try {
		const agent = await CallAgent.findById(req.params.agentId);
		if (!agent || agent.length === 0) {
			return res.status(404).json({ message: 'Call agent not found' });
		}
		res.json(agent[0]);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call agent', error: error.message });
	}
});

// Get all agents by company
router.get('/company/:companyId', async (req, res) => {
	try {
		const agents = await CallAgent.findByCompany(req.params.companyId);
		res.json(agents);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching company agents', error: error.message });
	}
});

// Update a call agent
router.put('/:agentId', async (req, res) => {
	try {
		const result = await CallAgent.update(req.params.agentId, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call agent not found' });
		}
		res.json({ message: 'Call agent updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call agent', error: error.message });
	}
});

// Delete a call agent
router.delete('/:agentId', async (req, res) => {
	try {
		const result = await CallAgent.delete(req.params.agentId);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call agent not found' });
		}
		res.json({ message: 'Call agent deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting call agent', error: error.message });
	}
});

// Toggle the active status of a call agent
router.put('/:agentId/active', async (req, res) => {
	try {
		const result = await CallAgent.toggleActive(req.params.agentId, req.body.is_active);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call agent not found' });
		}
		res.json({ message: 'Call agent active status updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call agent active status', error: error.message });
	}
});

module.exports = router;