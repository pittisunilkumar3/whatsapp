const express = require('express');
const router = express.Router();
const SuperAdminEmailConfig = require('../models/SuperAdminEmailConfig');

// Get all email configurations
router.get('/', async (req, res) => {
	try {
		const [configs] = await SuperAdminEmailConfig.findAll();
		res.json({
			success: true,
			data: configs
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// Get email configuration by ID
router.get('/:id', async (req, res) => {
	try {
		const [config] = await SuperAdminEmailConfig.findById(req.params.id);
		if (!config || config.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Email configuration not found'
			});
		}
		res.json({
			success: true,
			data: config[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// Create new email configuration
router.post('/', async (req, res) => {
	try {
		const [result] = await SuperAdminEmailConfig.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Email configuration created successfully',
			data: { id: result.insertId }
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Update email configuration
router.put('/:id', async (req, res) => {
	try {
		const [result] = await SuperAdminEmailConfig.update(req.params.id, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Email configuration not found'
			});
		}
		res.json({
			success: true,
			message: 'Email configuration updated successfully'
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Delete email configuration
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await SuperAdminEmailConfig.delete(req.params.id);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Email configuration not found'
			});
		}
		res.json({
			success: true,
			message: 'Email configuration deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;