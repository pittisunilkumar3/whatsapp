const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CompanyEmployee = require('../models/CompanyEmployee');

// Create a new employee
router.post('/', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		
		const employeeData = {
			...req.body,
			password: hashedPassword,
			is_active: 1,
			created_at: new Date(),
			updated_at: new Date()
		};
		
		const [result] = await CompanyEmployee.create(employeeData);
		res.status(201).json({ 
			message: 'Employee created successfully', 
			data: { id: result.insertId }
		});
	} catch (error) {
		console.error('Error creating employee:', error);
		res.status(500).json({ 
			error: 'Failed to create employee',
			details: error.message 
		});
	}
});

// Get all employees with filters
router.get('/', async (req, res) => {
	try {
		const filters = {
			company_id: req.query.company_id,
			department: req.query.department,
			designation: req.query.designation,
			is_active: req.query.is_active
		};
		const [employees] = await CompanyEmployee.findAll(filters);
		res.json({ data: employees });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get employees by company ID
router.get('/company/:companyId', async (req, res) => {
	try {
		const [employees] = await CompanyEmployee.findByCompanyId(req.params.companyId);
		res.json({ data: employees });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
	try {
		const [employees] = await CompanyEmployee.findById(req.params.id);
		if (employees.length === 0) {
			return res.status(404).json({ message: 'Employee not found' });
		}
		res.json({ data: employees[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update an employee
router.put('/:id', async (req, res) => {
	try {
		if (req.body.password) {
			req.body.password = await bcrypt.hash(req.body.password, 10);
		}
		await CompanyEmployee.update(req.params.id, req.body);
		res.json({ message: 'Employee updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete an employee
router.delete('/:id', async (req, res) => {
	try {
		await CompanyEmployee.delete(req.params.id);
		res.json({ message: 'Employee deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Employee login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}
		
		const [employees] = await CompanyEmployee.findByEmail(email);
		
		if (employees.length === 0) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		
		const employee = employees[0];
		
		const isValidPassword = await bcrypt.compare(password, employee.password);
		
		if (!isValidPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		
		const token = jwt.sign(
			{ 
				id: employee.id, 
				email: employee.email, 
				company_id: employee.company_id 
			},
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		);
		
		// Remove sensitive information
		delete employee.password;
		
		res.json({
			message: 'Login successful',
			data: {
				token,
				employee: {
					...employee,
					created_at: new Date(employee.created_at).toISOString(),
					updated_at: new Date(employee.updated_at).toISOString(),
					dob: new Date(employee.dob).toISOString(),
					date_of_joining: employee.date_of_joining ? new Date(employee.date_of_joining).toISOString() : null,
					date_of_leaving: employee.date_of_leaving ? new Date(employee.date_of_leaving).toISOString() : null
				}
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