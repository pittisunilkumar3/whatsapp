const express = require('express');
const router = express.Router();
const VoiceCampaign = require('../models/VoiceCampaign');
const { validateDateRange, validatePagination } = require('../utils/validators');

// Get all campaigns for a company
router.get('/:companyId', async (req, res) => {
    try {
        const {
            status,
            priority,
            start_date,
            end_date,
            is_active,
            search,
            sort = 'created_at',
            order = 'desc',
            limit = 50,
            offset = 0
        } = req.query;

        validatePagination(limit, offset);
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const campaigns = await VoiceCampaign.findByCompany(
            req.params.companyId,
            {
                status,
                priority,
                start_date,
                end_date,
                is_active,
                search,
                sort,
                order,
                limit,
                offset
            }
        );

        res.json(campaigns);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching company campaigns', error: error.message });
    }
});

// Get company campaign statistics
router.get('/:companyId/stats', async (req, res) => {
    try {
        const { start_date, end_date, status } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const stats = await VoiceCampaign.getCompanyStats(
            req.params.companyId,
            { start_date, end_date, status }
        );
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company campaign statistics', error: error.message });
    }
});

// Get active campaigns for a company
router.get('/:companyId/active', async (req, res) => {
    try {
        const { priority, limit = 50, offset = 0 } = req.query;
        validatePagination(limit, offset);

        const activeCampaigns = await VoiceCampaign.findActiveByCompany(
            req.params.companyId,
            { priority, limit, offset }
        );
        res.json(activeCampaigns);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching active campaigns', error: error.message });
    }
});

// Get company campaign performance
router.get('/:companyId/performance', async (req, res) => {
    try {
        const { start_date, end_date, interval = 'daily' } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const performance = await VoiceCampaign.getCompanyPerformance(
            req.params.companyId,
            { start_date, end_date, interval }
        );
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign performance', error: error.message });
    }
});

// Get company campaign team performance
router.get('/:companyId/team-performance', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const teamPerformance = await VoiceCampaign.getTeamPerformance(
            req.params.companyId,
            { start_date, end_date }
        );
        res.json(teamPerformance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team performance', error: error.message });
    }
});

// Get company campaign cost analysis
router.get('/:companyId/cost-analysis', async (req, res) => {
    try {
        const { start_date, end_date, campaign_ids } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const costAnalysis = await VoiceCampaign.getCostAnalysis(
            req.params.companyId,
            { 
                start_date, 
                end_date,
                campaign_ids: campaign_ids ? campaign_ids.split(',').map(Number) : null
            }
        );
        res.json(costAnalysis);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cost analysis', error: error.message });
    }
});

// Get company campaign quality metrics
router.get('/:companyId/quality-metrics', async (req, res) => {
    try {
        const { start_date, end_date, campaign_ids } = req.query;
        
        if (start_date && end_date) {
            validateDateRange(start_date, end_date);
        }

        const qualityMetrics = await VoiceCampaign.getQualityMetrics(
            req.params.companyId,
            { 
                start_date, 
                end_date,
                campaign_ids: campaign_ids ? campaign_ids.split(',').map(Number) : null
            }
        );
        res.json(qualityMetrics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quality metrics', error: error.message });
    }
});

module.exports = router; 