const express = require('express');
const router = express.Router();
const CompanyRolePermission = require('../models/CompanyRolePermission');

// Create a new company role permission
router.post('/', async (req, res) => {
	try {
		const [result] = await CompanyRolePermission.create(req.body);
		res.status(201).json({
			success: true,
			message: 'Company role permission created successfully',
			data: { id: result.insertId, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error creating company role permission',
			error: error.message
		});
	}
});

// Get all company role permissions
router.get('/', async (req, res) => {
	try {
		const [permissions] = await CompanyRolePermission.findAll(req.query);
		res.json({
			success: true,
			data: permissions
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company role permissions',
			error: error.message
		});
	}
});

// Get company role permission by ID
router.get('/:id', async (req, res) => {
	try {
		const [permission] = await CompanyRolePermission.findById(req.params.id);
		if (permission.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role permission not found'
			});
		}
		res.json({
			success: true,
			data: permission[0]
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company role permission',
			error: error.message
		});
	}
});

// Get permissions by company role
router.get('/company/:companyId/role/:roleId', async (req, res) => {
	try {
		const [permissions] = await CompanyRolePermission.findByCompanyRole(
			req.params.companyId,
			req.params.roleId
		);
		res.json({
			success: true,
			data: permissions
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching company role permissions',
			error: error.message
		});
	}
});

// Update company role permission
router.put('/:id', async (req, res) => {
	try {
		const [result] = await CompanyRolePermission.update(req.params.id, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role permission not found'
			});
		}
		res.json({
			success: true,
			message: 'Company role permission updated successfully',
			data: { id: req.params.id, ...req.body }
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error updating company role permission',
			error: error.message
		});
	}
});

// Delete company role permission
router.delete('/:id', async (req, res) => {
	try {
		const [result] = await CompanyRolePermission.delete(req.params.id);
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Company role permission not found'
			});
		}
		res.json({
			success: true,
			message: 'Company role permission deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error deleting company role permission',
			error: error.message
		});
	}
});

// Delete all permissions for a company role
router.delete('/company/:companyId/role/:roleId', async (req, res) => {
	try {
		const [result] = await CompanyRolePermission.deleteByCompanyRole(
			req.params.companyId,
			req.params.roleId
		);
		res.json({
			success: true,
			message: 'Company role permissions deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error deleting company role permissions',
			error: error.message
		});
	}
});

module.exports = router;