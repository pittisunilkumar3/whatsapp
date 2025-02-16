const express = require('express');
const router = express.Router();
const UltravoxConfiguration = require('../models/UltravoxConfiguration');

// Create ultravox configuration
router.post('/', async (req, res) => {

	try {
		const config = await UltravoxConfiguration.create(req.body);
		res.status(201).json({
			success: true,
			data: config
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Get all configurations
router.get('/', async (req, res) => {
	try {
		const configs = await UltravoxConfiguration.findAll();
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

// Get configurations for a company
router.get('/company/:companyId', async (req, res) => {
	try {
		const configs = await UltravoxConfiguration.findAll({
			where: { company_id: req.params.companyId }
		});
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

// Get single configuration
router.get('/:id', async (req, res) => {
	try {
		const config = await UltravoxConfiguration.findByPk(req.params.id);
		if (!config) {
			return res.status(404).json({
				success: false,
				message: 'Ultravox configuration not found'
			});
		}
		res.json({
			success: true,
			data: config
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// Update configuration
router.put('/:id', async (req, res) => {
	try {
		const config = await UltravoxConfiguration.findByPk(req.params.id);
		if (!config) {
			return res.status(404).json({
				success: false,
				message: 'Ultravox configuration not found'
			});
		}
		await config.update(req.body);
		res.json({
			success: true,
			data: config
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Delete configuration
router.delete('/:id', async (req, res) => {
	try {
		const config = await UltravoxConfiguration.findByPk(req.params.id);
		if (!config) {
			return res.status(404).json({
				success: false,
				message: 'Ultravox configuration not found'
			});
		}
		await config.destroy();
		res.json({
			success: true,
			message: 'Ultravox configuration deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;