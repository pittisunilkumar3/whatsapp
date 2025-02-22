const express = require('express');
const router = express.Router();
const Call = require('../models/Call');

/**
 * @api {post} /api/voice-calls/:companyId/campaigns/:campaignId/calls Create Voice Call Record
 * @apiDescription Create a new voice call record in the system
 * @apiVersion 1.0.0
 * @apiName CreateVoiceCall
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} campaignId Campaign ID
 * @apiBody {String} callId Unique identifier from call provider
 * @apiBody {String} callsid Twilio Call SID
 * @apiBody {Number} leadid ID of the associated lead
 * @apiBody {String} call_status Call status
 * @apiBody {Number} call_duration Call duration in seconds
 * @apiBody {String} recording_url Recording URL if available
 * @apiBody {Object} call_data Additional call data
 * 
 * @apiSuccess (201) {Number} id ID of the created call record
 * @apiSuccess (201) {String} message Success message
 * 
 * @apiError (400) {Object} error Error message if creation fails
 */
router.post('/:companyId/campaigns/:campaignId/calls', async (req, res) => {
    try {
        const { callId, callsid, leadid, call_status, call_duration, recording_url, call_data } = req.body;
        const callData = {
            callId,
            callsid,
            leadid: parseInt(leadid),
            companyid: parseInt(req.params.companyId),
            campaignId: parseInt(req.params.campaignId),
            call_status,
            call_duration: parseInt(call_duration) || 0,
            recording_url,
            call_data
        };

        const result = await Call.create(callData);
        res.status(201).json({ id: result, message: "Voice call record created successfully" });
    } catch (error) {
        console.error('Error creating call:', error);
        res.status(500).json({ message: "Error creating call", error: error.message });
    }
});

/**
 * @api {get} /api/voice-calls/:companyId/calls/:id Get Voice Call by ID
 * @apiDescription Get a specific voice call record by ID
 * @apiVersion 1.0.0
 * @apiName GetVoiceCall
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} id Call ID
 * 
 * @apiSuccess {Object} call Call record details
 * @apiError (404) {Object} error Call not found
 */
router.get('/:companyId/calls/:id', async (req, res) => {
    try {
        const call = await Call.findById(
            parseInt(req.params.id),
            parseInt(req.params.companyId)
        );
        
        if (!call) {
            return res.status(404).json({ message: "Call not found" });
        }
        
        res.json(call);
    } catch (error) {
        console.error('Error fetching call:', error);
        res.status(500).json({ message: "Error fetching call", error: error.message });
    }
});

/**
 * @api {get} /api/voice-calls/:companyId/campaigns/:campaignId/calls Get Voice Calls by Campaign
 * @apiDescription Retrieve all voice calls for a specific campaign
 * @apiVersion 1.0.0
 * @apiName GetVoiceCallsByCampaign
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} campaignId Campaign ID
 * @apiQuery {Number} [page=1] Page number for pagination
 * @apiQuery {Number} [limit=10] Number of records per page
 * 
 * @apiSuccess {Object[]} calls Array of call records
 * @apiSuccess {Number} total Total number of records
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} totalPages Total number of pages
 * 
 * @apiError (400) {Object} error Error message if retrieval fails
 */
router.get('/:companyId/campaigns/:campaignId/calls', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await Call.findByCampaignId(
            parseInt(req.params.campaignId),
            parseInt(req.params.companyId),
            parseInt(page),
            parseInt(limit)
        );
        res.json(result);
    } catch (error) {
        console.error('Error getting calls:', error);
        res.status(400).json({ message: "Error getting calls", error: error.message });
    }
});

/**
 * @api {get} /api/voice-calls/:companyId/leads/:leadid/calls Get Voice Calls by Lead
 * @apiDescription Retrieve all voice calls associated with a specific lead
 * @apiVersion 1.0.0
 * @apiName GetVoiceCallsByLead
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} leadid Lead ID
 * 
 * @apiSuccess {Object[]} calls Array of call records
 * 
 * @apiError (400) {Object} error Error message if retrieval fails
 */
router.get('/:companyId/leads/:leadid/calls', async (req, res) => {
    try {
        const calls = await Call.findByLeadId(
            parseInt(req.params.leadid),
            parseInt(req.params.companyId)
        );
        res.json(calls);
    } catch (error) {
        console.error('Error getting calls:', error);
        res.status(400).json({ message: "Error getting calls", error: error.message });
    }
});

/**
 * @api {put} /api/voice-calls/:companyId/calls/:id Update Voice Call
 * @apiDescription Update a voice call record
 * @apiVersion 1.0.0
 * @apiName UpdateVoiceCall
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} id Call ID
 * @apiBody {String} [call_status] Updated call status
 * @apiBody {Number} [call_duration] Updated call duration
 * @apiBody {String} [recording_url] Updated recording URL
 * @apiBody {Object} [call_data] Updated call data
 * 
 * @apiSuccess {Boolean} success Update success status
 * 
 * @apiError (400) {Object} error Error message if update fails
 */
router.put('/:companyId/calls/:id', async (req, res) => {
    try {
        const success = await Call.update(
            parseInt(req.params.id),
            parseInt(req.params.companyId),
            req.body
        );
        if (!success) {
            return res.status(404).json({ message: "Call not found or not updated" });
        }
        res.json({ message: "Call updated successfully" });
    } catch (error) {
        console.error('Error updating call:', error);
        res.status(400).json({ message: "Error updating call", error: error.message });
    }
});

/**
 * @api {delete} /api/voice-calls/:companyId/calls/:id Delete Voice Call
 * @apiDescription Soft delete a voice call record
 * @apiVersion 1.0.0
 * @apiName DeleteVoiceCall
 * @apiGroup VoiceCalls
 * 
 * @apiParam {Number} companyId Company ID
 * @apiParam {Number} id Call ID
 * 
 * @apiSuccess {Boolean} success Deletion success status
 * 
 * @apiError (400) {Object} error Error message if deletion fails
 */
router.delete('/:companyId/calls/:id', async (req, res) => {
    try {
        const success = await Call.delete(
            parseInt(req.params.id),
            parseInt(req.params.companyId)
        );
        if (!success) {
            return res.status(404).json({ message: "Call not found or not deleted" });
        }
        res.json({ message: "Call deleted successfully" });
    } catch (error) {
        console.error('Error deleting call:', error);
        res.status(400).json({ message: "Error deleting call", error: error.message });
    }
});

module.exports = router;
