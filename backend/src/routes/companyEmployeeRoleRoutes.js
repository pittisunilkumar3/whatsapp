const express = require('express');
const router = express.Router();
const CompanyEmployeeRole = require('../models/CompanyEmployeeRole');

// Create a new company employee role
router.post('/', async (req, res) => {
	try {
		const [result] = await CompanyEmployeeRole.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Company employee role created successfully',
			data: { id: result.insertId, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error creating company employee role',
			error: error.message
		});
	}
});

// Get all company employee roles
router.get('/', async (req, res) => {
	try {
		const [roles] = await CompanyEmployeeRole.findAll(req.query);
		res.json({
			success: true,
			data: roles
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company employee roles',
			error: error.message
		});
	}
});

// Get company employee role by ID
router.get('/:id', async (req, res) => {
	try {
		const [role] = await CompanyEmployeeRole.findById(req.params.id);
		if (role.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company employee role not found'
			});
		}
		res.json({
			success: true,
			data: role[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company employee role',
			error: error.message
		});
	}
});

// Get roles by staff ID
router.get('/staff/:staffId', async (req, res) => {
	try {
		const [roles] = await CompanyEmployeeRole.findByStaffId(req.params.staffId);
		res.json({
			success: true,
			data: roles
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching staff roles',
			error: error.message
		});
	}
});

// Update company employee role
router.put('/:id', async (req, res) => {
	try {
		const [result] = await CompanyEmployeeRole.update(req.params.id, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company employee role not found'
			});
		}
		res.json({
			success: true,
			message: 'Company employee role updated successfully',
			data: { id: req.params.id, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error updating company employee role',
			error: error.message
		});
	}
});

// Delete company employee role
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await CompanyEmployeeRole.delete(req.params.id);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company employee role not found'
			});
		}
		res.json({
			success: true,
			message: 'Company employee role deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error deleting company employee role',
			error: error.message
		});
	}
});

// Toggle company employee role active status
router.patch('/:id/toggle-active', async (req, res) => {
	try {
		const { is_active } = req.body;
		const [result] = await CompanyEmployeeRole.toggleActive(req.params.id, is_active);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company employee role not found'
			});
		}
		res.json({
			success: true,
			message: `Company employee role ${is_active ? 'activated' : 'deactivated'} successfully`
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error toggling company employee role status',
			error: error.message
		});
	}
});

module.exports = router;