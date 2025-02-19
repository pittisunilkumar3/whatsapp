const express = require('express');
const router = express.Router();
const VoiceLead = require('../models/VoiceLead');
const { validateDateRange, validatePagination } = require('../utils/validators');

// Get all leads for a company
router.get('/company/:companyId', async (req, res) => {
    try {
        const { campaign_id, status, assigned_to } = req.query;
        const leads = await VoiceLead.findByCompany(
            req.params.companyId,
            { campaign_id, status, assigned_to }
        );
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company leads', error: error.message });
    }
});

// Get company lead analytics
router.get('/company/:companyId/analytics', async (req, res) => {
    try {
        const { start_date, end_date, campaign_ids } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const analytics = await VoiceLead.getCompanyAnalytics(
            req.params.companyId,
            { 
                start_date, 
                end_date,
                campaign_ids: campaign_ids ? campaign_ids.split(',').map(Number) : null
            }
        );
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead analytics', error: error.message });
    }
});

// Get company lead quality report
router.get('/company/:companyId/quality-report', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const qualityReport = await VoiceLead.getQualityReport(
            req.params.companyId,
            { start_date, end_date }
        );
        res.json(qualityReport);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead quality report', error: error.message });
    }
});

// Get company lead assignment stats
router.get('/company/:companyId/assignment-stats', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const assignmentStats = await VoiceLead.getAssignmentStats(
            req.params.companyId,
            { start_date, end_date }
        );
        res.json(assignmentStats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead assignment stats', error: error.message });
    }
});

// Get company lead conversion analysis
router.get('/company/:companyId/conversion-analysis', async (req, res) => {
    try {
        const { start_date, end_date, campaign_ids } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const conversionAnalysis = await VoiceLead.getConversionAnalysis(
            req.params.companyId,
            { 
                start_date, 
                end_date,
                campaign_ids: campaign_ids ? campaign_ids.split(',').map(Number) : null
            }
        );
        res.json(conversionAnalysis);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead conversion analysis', error: error.message });
    }
});

// Bulk update leads for company
router.patch('/company/:companyId/bulk-update', async (req, res) => {
    try {
        const { lead_ids, updates } = req.body;
        
        if (!Array.isArray(lead_ids) || lead_ids.length === 0) {
            throw new Error('lead_ids must be a non-empty array');
        }

        const result = await VoiceLead.bulkUpdate(
            req.params.companyId,
            lead_ids,
            updates
        );
        res.json({ 
            message: 'Leads updated successfully',
            updated_count: result.affectedRows
        });
    } catch (error) {
        res.status(400).json({ message: 'Error updating leads', error: error.message });
    }
});

// Bulk assign leads for company
router.patch('/company/:companyId/bulk-assign', async (req, res) => {
    try {
        const { lead_ids, assigned_to } = req.body;
        
        if (!Array.isArray(lead_ids) || lead_ids.length === 0) {
            throw new Error('lead_ids must be a non-empty array');
        }

        if (!assigned_to) {
            throw new Error('assigned_to is required');
        }

        const result = await VoiceLead.bulkAssign(
            req.params.companyId,
            lead_ids,
            assigned_to,
            req.user.id
        );
        res.json({ 
            message: 'Leads assigned successfully',
            assigned_count: result.affectedRows
        });
    } catch (error) {
        res.status(400).json({ message: 'Error assigning leads', error: error.message });
    }
});

// Import leads for company
router.post('/company/:companyId/import', async (req, res) => {
    try {
        const { campaign_id, leads, default_values } = req.body;
        
        if (!Array.isArray(leads) || leads.length === 0) {
            throw new Error('leads must be a non-empty array');
        }

        if (!campaign_id) {
            throw new Error('campaign_id is required');
        }

        const result = await VoiceLead.bulkImport(
            req.params.companyId,
            campaign_id,
            leads,
            default_values
        );
        res.status(201).json({ 
            message: 'Leads imported successfully',
            imported_count: result.length,
            leads: result
        });
    } catch (error) {
        res.status(400).json({ message: 'Error importing leads', error: error.message });
    }
});

// Export company leads
router.get('/company/:companyId/export', async (req, res) => {
    try {
        const { format = 'csv', campaign_ids, status, start_date, end_date } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const exportData = await VoiceLead.exportLeads(
            req.params.companyId,
            { 
                format,
                campaign_ids: campaign_ids ? campaign_ids.split(',').map(Number) : null,
                status,
                start_date,
                end_date
            }
        );

        // Set appropriate headers based on format
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        } else if (format === 'xlsx') {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');
        }

        res.send(exportData);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting leads', error: error.message });
    }
});

module.exports = router; 