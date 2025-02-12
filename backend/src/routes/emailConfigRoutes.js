const express = require('express');
const router = express.Router();
const EmailConfig = require('../models/EmailConfig');

// Get all email configs
router.get('/', async (req, res) => {
	try {
		const configs = await EmailConfig.getAll();
		res.json(configs);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching email configs', error: error.message });
	}
});

// Get email configs by company ID
router.get('/company/:companyId', async (req, res) => {
	try {
		const configs = await EmailConfig.getByCompanyId(req.params.companyId);
		res.json(configs);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching company email configs', error: error.message });
	}
});

// Get email config by ID
router.get('/:id', async (req, res) => {
	try {
		const config = await EmailConfig.getById(req.params.id);
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
		const configId = await EmailConfig.create(req.body);
		const newConfig = await EmailConfig.getById(configId);
		res.status(201).json(newConfig);
	} catch (error) {
		res.status(500).json({ message: 'Error creating email config', error: error.message });
	}
});

// Update email config
router.put('/:id', async (req, res) => {
	try {
		const success = await EmailConfig.update(req.params.id, req.body);
		if (!success) {
			return res.status(404).json({ message: 'Email config not found' });
		}
		const updatedConfig = await EmailConfig.getById(req.params.id);
		res.json(updatedConfig);
	} catch (error) {
		res.status(500).json({ message: 'Error updating email config', error: error.message });
	}
});

// Delete email config
router.delete('/:id', async (req, res) => {
	try {
		const success = await EmailConfig.delete(req.params.id);
		if (!success) {
			return res.status(404).json({ message: 'Email config not found' });
		}
		res.json({ message: 'Email config deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting email config', error: error.message });
	}
});

module.exports = router;