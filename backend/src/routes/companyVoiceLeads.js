const express = require('express');
const router = express.Router();
const VoiceLead = require('../models/VoiceLead');
const { validateDateRange, validatePagination } = require('../utils/validators');
const multer = require('multer');
const csv = require('csv-parse');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

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

// Import leads for company from file
router.post('/company/:companyId/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const { campaign_id, default_values } = req.body;
        
        if (!campaign_id) {
            throw new Error('campaign_id is required');
        }

        let leads = [];
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        if (fileExt === '.csv') {
            // Parse CSV file
            const fileContent = await fs.promises.readFile(req.file.path, 'utf-8');
            leads = await new Promise((resolve, reject) => {
                csv.parse(fileContent, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                }, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
            // Parse Excel file
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            leads = xlsx.utils.sheet_to_json(worksheet);
        }

        // Clean up the uploaded file
        await fs.promises.unlink(req.file.path);

        // Validate and process leads
        if (!Array.isArray(leads) || leads.length === 0) {
            throw new Error('No valid leads found in the file');
        }

        // Process phone numbers to ensure E.164 format
        leads = leads.map(lead => ({
            ...lead,
            phone: formatPhoneNumber(lead.phone)
        }));

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
        // Clean up uploaded file in case of error
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(400).json({ 
            message: 'Error importing leads', 
            error: error.message 
        });
    }
});

// Helper function to format phone numbers to E.164
function formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, '');
    
    // Check if the number already starts with '+'
    if (phone.startsWith('+')) {
        return phone;
    }
    
    // Add country code if not present (assuming US/Canada numbers if no country code)
    if (numbers.length === 10) {
        return `+1${numbers}`;
    }
    
    // If number includes country code but no '+', add it
    if (numbers.length > 10) {
        return `+${numbers}`;
    }
    
    throw new Error(`Invalid phone number format: ${phone}`);
}

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