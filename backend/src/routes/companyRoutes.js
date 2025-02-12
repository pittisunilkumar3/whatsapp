const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const db = require('../../db');

// Create a new company
router.post('/', async (req, res) => {
	try {
		// Hash password
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		
		const companyData = {
			...req.body,
			password: hashedPassword,
			created_at: new Date(),
			updated_at: new Date()
		};
		
		const [result] = await Company.create(companyData);
		res.status(201).json({ 
			message: 'Company created successfully', 
			data: { id: result.insertId }
		});
	} catch (error) {
		console.error('Error creating company:', error);
		res.status(500).json({ 
			error: 'Failed to create company',
			details: error.message 
		});
	}
});

// Get all companies with optional filters
router.get('/', async (req, res) => {
	try {
		const filters = {
			status: req.query.status,
			industry: req.query.industry
		};
		const [companies] = await Company.findAll(filters);
		res.json({ data: companies });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single company by ID
router.get('/:id', async (req, res) => {
	try {
		const [companies] = await Company.findById(req.params.id);
		if (companies.length === 0) {
			return res.status(404).json({ message: 'Company not found' });
		}
		res.json({ data: companies[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a company
router.put('/:id', async (req, res) => {
	try {
		await Company.update(req.params.id, req.body);
		res.json({ message: 'Company updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a company
router.delete('/:id', async (req, res) => {
	try {
		await Company.delete(req.params.id);
		res.json({ message: 'Company deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Reset password request
router.post('/reset-password-request', async (req, res) => {
	try {
		const { username } = req.body;
		const [companies] = await Company.findByUsername(username);
		
		if (companies.length === 0) {
			return res.status(404).json({ message: 'Company not found' });
		}
		
		res.json({ message: 'Password reset instructions sent to company email' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Reset password
router.post('/reset-password', async (req, res) => {
	try {
		const { username, newPassword } = req.body;
		const [companies] = await Company.findByUsername(username);

		if (companies.length === 0) {
			return res.status(404).json({ message: 'Company not found' });
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await Company.update(companies[0].id, { password: hashedPassword });
		
		res.json({ message: 'Password reset successful' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Company login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		
		// Find company by username
		const [companies] = await Company.findByUsername(username);
		
		if (companies.length === 0) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		
		const company = companies[0];
		
		// Verify password
		const isValidPassword = await bcrypt.compare(password, company.password);
		
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		
		// Generate JWT token
		const token = jwt.sign(
			{ id: company.id, username: company.username },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);
		
		// Remove sensitive data before sending response
		delete company.password;
		delete company.two_factor_secret;
		delete company.backup_codes;
		
		res.json({
			message: 'Login successful',
			data: {
				token,
				company: company // Return all company data except sensitive fields
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ 
			error: 'Login failed',
			details: error.message 
		});
	}
});

module.exports = router;

