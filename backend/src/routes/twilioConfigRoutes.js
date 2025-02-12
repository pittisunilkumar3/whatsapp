const express = require('express');
const router = express.Router();
const TwilioConfig = require('../models/TwilioConfig');

// Create new Twilio configuration
router.post('/', async (req, res) => {
	try {
		const twilioConfig = await TwilioConfig.create(req.body);
		res.status(201).json({
			success: true,
			data: twilioConfig
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Get Twilio configuration by ID
router.get('/:id', async (req, res) => {
	try {
		const twilioConfig = await TwilioConfig.findByPk(req.params.id);
		if (!twilioConfig) {
			return res.status(404).json({
				success: false,
				message: 'Twilio configuration not found'
			});
		}
		res.json({
			success: true,
			data: twilioConfig
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// Get Twilio configuration by company ID
router.get('/company/:companyId', async (req, res) => {
	try {
		const twilioConfig = await TwilioConfig.findOne({
			where: { company_id: req.params.companyId }
		});
		if (!twilioConfig) {
			return res.status(404).json({
				success: false,
				message: 'Twilio configuration not found for this company'
			});
		}
		res.json({
			success: true,
			data: twilioConfig
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// Update Twilio configuration
router.put('/:id', async (req, res) => {
	try {
		const twilioConfig = await TwilioConfig.findByPk(req.params.id);
		if (!twilioConfig) {
			return res.status(404).json({
				success: false,
				message: 'Twilio configuration not found'
			});
		}
		await twilioConfig.update(req.body);
		res.json({
			success: true,
			data: twilioConfig
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
});

// Delete Twilio configuration
router.delete('/:id', async (req, res) => {
	try {
		const twilioConfig = await TwilioConfig.findByPk(req.params.id);
		if (!twilioConfig) {
			return res.status(404).json({
				success: false,
				message: 'Twilio configuration not found'
			});
		}
		await twilioConfig.destroy();
		res.json({
			success: true,
			message: 'Twilio configuration deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

// List all Twilio configurations
router.get('/', async (req, res) => {
	try {
		const twilioConfigs = await TwilioConfig.findAll();
		res.json({
			success: true,
			data: twilioConfigs
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;