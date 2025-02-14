const express = require('express');
const router = express.Router();
const CompanyRole = require('../models/CompanyRole');

// Create a new company role
router.post('/', async (req, res) => {
	try {
		const [result] = await CompanyRole.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Company role created successfully',
			data: { id: result.insertId, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error creating company role',
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
			message: 'Error fetching company roles',
			error: error.message
		});
	}
});

// Get company role by ID
router.get('/:id', async (req, res) => {
	try {
		const [role] = await CompanyRole.findById(req.params.id);
		if (role.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			data: role[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company role',
			error: error.message
		});
	}
});

// Update company role
router.put('/:id', async (req, res) => {
	try {
		const [result] = await CompanyRole.update(req.params.id, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			message: 'Company role updated successfully',
			data: { id: req.params.id, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error updating company role',
			error: error.message
		});
	}
});

// Delete company role
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await CompanyRole.delete(req.params.id);
		if (result.affectedRows === 0) {
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
			message: 'Error deleting company role',
			error: error.message
		});
	}
});

// Toggle company role active status
router.patch('/:id/toggle-active', async (req, res) => {
	try {
		const { is_active } = req.body;
		const [result] = await CompanyRole.toggleActive(req.params.id, is_active);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role not found'
			});
		}
		res.json({
			success: true,
			message: `Company role ${is_active ? 'activated' : 'deactivated'} successfully`
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error toggling company role status',
			error: error.message
		});
	}
});

module.exports = router;