const express = require('express');
const router = express.Router();
const SuperadminRolePermission = require('../models/SuperadminRolePermission');

// Create a new superadmin role permission
router.post('/', async (req, res) => {
	try {
		const [result] = await SuperadminRolePermission.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Superadmin role permission created successfully',
			data: { id: result.insertId, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error creating superadmin role permission',
			error: error.message
		});
	}
});

// Get all superadmin role permissions
router.get('/', async (req, res) => {
	try {
		const [permissions] = await SuperadminRolePermission.findAll(req.query);
		res.json({
			success: true,
			data: permissions
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching superadmin role permissions',
			error: error.message
		});
	}
});

// Get superadmin role permission by ID
router.get('/:id', async (req, res) => {
	try {
		const [permission] = await SuperadminRolePermission.findById(req.params.id);
		if (permission.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Superadmin role permission not found'
			});
		}
		res.json({
			success: true,
			data: permission[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching superadmin role permission',
			error: error.message
		});
	}
});

// Get permissions by role
router.get('/role/:roleId', async (req, res) => {
	try {
		const [permissions] = await SuperadminRolePermission.findByRole(req.params.roleId);
		res.json({
			success: true,
			data: permissions
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching role permissions',
			error: error.message
		});
	}
});

// Update superadmin role permission
router.put('/:id', async (req, res) => {
	try {
		const [result] = await SuperadminRolePermission.update(req.params.id, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Superadmin role permission not found'
			});
		}
		res.json({
			success: true,
			message: 'Superadmin role permission updated successfully',
			data: { id: req.params.id, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error updating superadmin role permission',
			error: error.message
		});
	}
});

// Delete superadmin role permission
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await SuperadminRolePermission.delete(req.params.id);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Superadmin role permission not found'
			});
		}
		res.json({
			success: true,
			message: 'Superadmin role permission deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error deleting superadmin role permission',
			error: error.message
		});
	}
});

// Delete all permissions for a role
router.delete('/role/:roleId', async (req, res) => {
	try {
		await SuperadminRolePermission.deleteByRole(req.params.roleId);
		res.json({
			success: true,
			message: 'Superadmin role permissions deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error deleting superadmin role permissions',
			error: error.message
		});
	}
});

module.exports = router;