const express = require('express');
const router = express.Router();
const CallReport = require('../models/CallReport');

// Create a new call report
router.post('/', async (req, res) => {
	try {
		const result = await CallReport.create(req.body);
		res.status(201).json({ message: 'Call report created successfully', data: result });
	} catch (error) {
		res.status(500).json({ message: 'Error creating call report', error: error.message });
	}
});

// Get all call reports
router.get('/', async (req, res) => {
	try {
		const reports = await CallReport.findAll(req.query);
		res.json(reports);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call reports', error: error.message });
	}
});

// Get a specific call report by ID
router.get('/:reportId', async (req, res) => {
	try {
		const report = await CallReport.findById(req.params.reportId);
		if (!report || report.length === 0) {
			return res.status(404).json({ message: 'Call report not found' });
		}
		res.json(report[0]);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching call report', error: error.message });
	}
});

// Get reports by company
router.get('/company/:companyId', async (req, res) => {
	try {
		const reports = await CallReport.findByCompany(req.params.companyId);
		res.json(reports);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching company reports', error: error.message });
	}
});

// Get reports by campaign
router.get('/campaign/:campaignId', async (req, res) => {
	try {
		const reports = await CallReport.findByCampaign(req.params.campaignId);
		res.json(reports);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching campaign reports', error: error.message });
	}
});

// Update a call report
router.put('/:reportId', async (req, res) => {
	try {
		const result = await CallReport.update(req.params.reportId, req.body);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call report not found' });
		}
		res.json({ message: 'Call report updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call report', error: error.message });
	}
});

// Delete a call report
router.delete('/:reportId', async (req, res) => {
	try {
		const result = await CallReport.delete(req.params.reportId);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call report not found' });
		}
		res.json({ message: 'Call report deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting call report', error: error.message });
	}
});

// Toggle report active status
router.put('/:reportId/active', async (req, res) => {
	try {
		const result = await CallReport.toggleActive(req.params.reportId, req.body.is_active);
		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Call report not found' });
		}
		res.json({ message: 'Call report active status updated successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error updating call report active status', error: error.message });
	}
});

module.exports = router;