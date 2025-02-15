const express = require('express');
const router = express.Router();
const CompanyRole = require('../models/CompanyRole');

// Create company role
router.post('/', async (req, res) => {
	try {
		const role = await CompanyRole.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Company role created successfully',
			data: role
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to create company role',
			error: error.message
		});
	}
});

// Get all company roles
router.get('/', async (req, res) => {
	try {
		const [roles] = await CompanyRole.findAll(req.query);
		res.json({
			success: true,
			data: roles
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch company roles',
			error: error.message
		});
	}
});

// Get company role by ID
router.get('/:id', async (req, res) => {
	try {
		const [roles] = await CompanyRole.findById(req.params.id);
		if (roles.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			data: roles[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch company role',
			error: error.message
		});
	}
});

// Update company role
router.put('/:id', async (req, res) => {
	try {
		const success = await CompanyRole.update(req.params.id, req.body);
		if (!success) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		const [updated] = await CompanyRole.findById(req.params.id);
		res.json({
			success: true,
			message: 'Company role updated successfully',
			data: updated[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to update company role',
			error: error.message
		});
	}
});

// Delete company role
router.delete('/:id', async (req, res) => {
	try {
		const success = await CompanyRole.delete(req.params.id);
		if (!success) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			message: 'Company role deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to delete company role',
			error: error.message
		});
	}
});

// Toggle company role active status
router.patch('/:id/toggle-active', async (req, res) => {
	try {
		const success = await CompanyRole.toggleActive(req.params.id, req.body.is_active);
		if (!success) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			message: `Company role ${req.body.is_active ? 'activated' : 'deactivated'} successfully`
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to toggle company role status',
			error: error.message
		});
	}
});

module.exports = router;