const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const SuperAdmin = require('../models/SuperAdmin');

// Login endpoint
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		
		const superadmin = await SuperAdmin.findByEmail(email);
		if (!superadmin) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const isValid = await SuperAdmin.verifyPassword(superadmin, password);
		if (!isValid) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		await SuperAdmin.updateLastLogin(superadmin.id);
		
		// Remove sensitive data before sending response
		const { password_hash, ...superadminData } = superadmin;
		
		res.json({
			success: true,
			message: 'Login successful',
			data: superadminData
		});
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});


// Create a new superadmin
router.post('/', async (req, res) => {
	try {
		const { first_name, last_name, username, email, password, phone_number, country_code } = req.body;
		
		// Check if email already exists
		const existingAdmin = await SuperAdmin.findByEmail(email);
		if (existingAdmin) {
			return res.status(400).json({ error: 'Email already registered' });
		}

		const id = await SuperAdmin.create({
			first_name,
			last_name,
			username,
			email,
			password,
			phone_number,
			country_code
		});

		res.status(201).json({ message: 'SuperAdmin created successfully', id });
	} catch (error) {
		console.error('Error creating superadmin:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Get superadmin by ID
router.get('/:id', async (req, res) => {
	try {
		const superadmin = await SuperAdmin.findById(req.params.id);
		if (!superadmin) {
			return res.status(404).json({ error: 'SuperAdmin not found' });
		}
		delete superadmin.password_hash;
		res.json(superadmin);
	} catch (error) {
		console.error('Error fetching superadmin:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Update superadmin
router.put('/:id', async (req, res) => {
	try {
		const { password, ...updateData } = req.body;
		
		if (password) {
			updateData.password_hash = await bcrypt.hash(password, 10);
		}

		const success = await SuperAdmin.update(req.params.id, updateData);
		if (!success) {
			return res.status(404).json({ error: 'SuperAdmin not found' });
		}
		
		res.json({ message: 'SuperAdmin updated successfully' });
	} catch (error) {
		console.error('Error updating superadmin:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Delete superadmin (soft delete)
router.delete('/:id', async (req, res) => {
	try {
		const success = await SuperAdmin.delete(req.params.id);
		if (!success) {
			return res.status(404).json({ error: 'SuperAdmin not found' });
		}
		res.json({ message: 'SuperAdmin deleted successfully' });
	} catch (error) {
		console.error('Error deleting superadmin:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
