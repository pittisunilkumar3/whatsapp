const express = require('express');
const router = express.Router();
const SuperAdminEmailConfig = require('../models/SuperAdminEmailConfig');

// Get all email configs
router.get('/', async (req, res) => {
	try {
		const configs = await SuperAdminEmailConfig.getAll();
		res.json(configs);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching email configs', error: error.message });
	}
});

// Get email config by ID
router.get('/:id', async (req, res) => {
	try {
		const config = await SuperAdminEmailConfig.getById(req.params.id);
		if (!config) {
			return res.status(404).json({ message: 'Email config not found' });
		}
		res.json(config);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching email config', error: error.message });
	}
});

// Create new email config
router.post('/', async (req, res) => {
	try {
		const configId = await SuperAdminEmailConfig.create(req.body);
		const newConfig = await SuperAdminEmailConfig.getById(configId);
		res.status(201).json(newConfig);
	} catch (error) {
		res.status(500).json({ message: 'Error creating email config', error: error.message });
	}
});

// Update email config
router.put('/:id', async (req, res) => {
	try {
		const success = await SuperAdminEmailConfig.update(req.params.id, req.body);
		if (!success) {
			return res.status(404).json({ message: 'Email config not found' });
		}
		const updatedConfig = await SuperAdminEmailConfig.getById(req.params.id);
		res.json(updatedConfig);
	} catch (error) {
		res.status(500).json({ message: 'Error updating email config', error: error.message });
	}
});

// Delete email config
router.delete('/:id', async (req, res) => {
	try {
		const success = await SuperAdminEmailConfig.delete(req.params.id);
		if (!success) {
			return res.status(404).json({ message: 'Email config not found' });
		}
		res.json({ message: 'Email config deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting email config', error: error.message });
	}
});

module.exports = router;