const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const https = require('https');

const TwilioConfig = require('../models/TwilioConfig');
const UltravoxConfiguration = require('../models/UltravoxConfiguration');

/**
 * Creates an Ultravox call configuration from database settings
 * @param {number} companyId - The company ID to fetch configurations for
 * @returns {Promise<{joinUrl: string}>}
 */


async function createUltravoxCall(companyId) {
    try {
        // Fetch Twilio and Ultravox configurations for the specific company
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        const ultravoxConfig = await UltravoxConfiguration.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig || !ultravoxConfig) {
            throw new Error('Configuration not found for the specified company');
        }

        // Prepare Ultravox Call Configuration
        const ULTRAVOX_CALL_CONFIG = {
            systemPrompt: ultravoxConfig.system_prompt,
            model: ultravoxConfig.model,
            voice: ultravoxConfig.voice,
            temperature: 0.3,
            firstSpeaker: ultravoxConfig.firstspeaker,
            medium: { "twilio": {} }
        };

        // Create Ultravox Call
        const request = https.request(ultravoxConfig.apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': ultravoxConfig.apikey
            }
        });

        return new Promise((resolve, reject) => {
            let data = '';

            request.on('response', (response) => {
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });

            request.on('error', reject);
            request.write(JSON.stringify(ULTRAVOX_CALL_CONFIG));
            request.end();
        });
    } catch (error) {
        console.error('Error creating Ultravox call:', error);
        throw error;
    }
}




async function testcreateUltravoxCall(companyId, systemPrompt, voice) {
    try {
        // Fetch Twilio and Ultravox configurations for the specific company
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        const ultravoxConfig = await UltravoxConfiguration.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig || !ultravoxConfig) {
            throw new Error('Configuration not found for the specified company');
        }

        // Prepare Ultravox Call Configuration
        const ULTRAVOX_CALL_CONFIG = {
            systemPrompt: systemPrompt || ultravoxConfig.system_prompt,
            model: ultravoxConfig.model,
            voice: voice || ultravoxConfig.voice,
            temperature: 0.3,
            firstSpeaker: ultravoxConfig.firstspeaker,
            medium: { "twilio": {} }
        };

        // Create Ultravox Call
        const request = https.request(ultravoxConfig.apiurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': ultravoxConfig.apikey
            }
        });

        return new Promise((resolve, reject) => {
            let data = '';

            request.on('response', (response) => {
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (parseError) {
                        reject(parseError);
                    }
                });
            });

            request.on('error', reject);
            request.write(JSON.stringify(ULTRAVOX_CALL_CONFIG));
            request.end();
        });
    } catch (error) {
        console.error('Error creating Ultravox call:', error);
        throw error;
    }
}
/**
 * Route to initiate an Ultravox call for a specific company
 */
router.post('/initiate-call', async (req, res) => {
    try {
        const { companyId, destinationNumber } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Fetch Twilio configuration
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig) {
            return res.status(404).json({ error: 'Twilio configuration not found' });
        }

        // Create Ultravox Call
        const { joinUrl } = await createUltravoxCall(companyId);

        // Initiate Twilio Call
        const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
        const call = await client.calls.create({
            twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
            to: destinationNumber || twilioConfig.phone_number,
            from: twilioConfig.phone_number
        });

        res.status(200).json({ 
            message: 'Call initiated successfully', 
            callSid: call.sid,
            joinUrl: joinUrl 
        });
    } catch (error) {
        console.error('Error initiating call:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Route to initiate sequential Ultravox calls from an array of phone numbers
 */


router.post('/bulk-calls-sequential', async (req, res) => {
    try {
        const { 
            companyId, 
            phoneNumbers, 
            twimlUrl = 'http://demo.twilio.com/docs/voice.xml' 
        } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return res.status(400).json({ error: 'Phone numbers array is required and must not be empty' });
        }

        // Fetch Twilio configuration
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig) {
            return res.status(404).json({ error: 'Twilio configuration not found' });
        }

        // Initialize call results tracking
        const callResults = [];
        const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);

        // Function to initiate a call and process sequentially
        const initiateSequentialCall = async (index) => {
            
            if (index >= phoneNumbers.length) {
                return callResults;
            }

            const phoneNumber = phoneNumbers[index];
            
            try {
                // Create Ultravox Call
                const { joinUrl } = await createUltravoxCall(companyId);

                // Initiate Twilio Call
                const call = await client.calls.create({

                    twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
                    to: phoneNumber,
                    from: twilioConfig.phone_number

                });

                // Track call result
                callResults.push({
                    phoneNumber,
                    status: 'initiated',
                    callSid: call.sid,
                    joinUrl
                });

                // Check call status and proceed to next call
                return new Promise((resolve, reject) => {
                    const checkCallStatus = () => {
                        client.calls(call.sid)
                            .fetch()
                            .then((fetchedCall) => {
                                if (fetchedCall.status === 'completed') {
                                    console.log(`Call to ${fetchedCall.to} completed.`);
                                    callResults[index].status = 'completed';
                                    resolve(initiateSequentialCall(index + 1));
                                } else if (fetchedCall.status === 'busy') {
                                    console.log(`Call to ${fetchedCall.to} failed, recipient's line is busy.`);
                                    callResults[index].status = 'busy';
                                    resolve(initiateSequentialCall(index + 1));
                                } else if (fetchedCall.status === 'failed') {
                                    console.log(`Call to ${fetchedCall.to} failed.`);
                                    callResults[index].status = 'failed';
                                    resolve(initiateSequentialCall(index + 1));
                                } else if (fetchedCall.status === 'no-answer') {
                                    console.log(`Call to ${fetchedCall.to} was not answered.`);
                                    callResults[index].status = 'no-answer';
                                    resolve(initiateSequentialCall(index + 1));
                                } else if (fetchedCall.status === 'cancelled') {
                                    console.log(`Call to ${fetchedCall.to} was cancelled, possibly hung up.`);
                                    callResults[index].status = 'cancelled';
                                    resolve(initiateSequentialCall(index + 1));
                                } else {
                                    console.log(`Call to ${fetchedCall.to} is still in progress...`);
                                    setTimeout(checkCallStatus, 5000); // Check every 5 seconds
                                }
                            })
                            .catch((error) => {
                                console.error(`Error fetching call status: ${error.message}`);
                                callResults[index].status = 'error';
                                callResults[index].error = error.message;
                                resolve(initiateSequentialCall(index + 1));
                            });
                    };

                    setTimeout(checkCallStatus, 5000);
                });
            
            } catch (callError) {
                // Handle call initiation error
                callResults.push({
                    phoneNumber,
                    status: 'initiation_error',
                    error: callError.message
                });

                return initiateSequentialCall(index + 1);
            }
        };

        // Start sequential call processing
        await initiateSequentialCall(0);

        res.status(200).json({ 
            message: 'Bulk calls processed sequentially', 
            totalCalls: phoneNumbers.length,
            callResults 
        });

    } catch (error) {
        console.error('Error processing bulk calls:', error);
        res.status(500).json({ error: error.message });
    }
});



/**
 * Route to fetch available voices from Ultravox API
 */
router.post('/ultravox-voices', async (req, res) => {
    try {
        // Extract request parameters
        const { 
            companyId, 
            cursor, 
            limit = 10,
            filters = {} 
        } = req.body;

        // Validate company ID
        if (!companyId) {
            return res.status(400).json({ 
                error: 'Company ID is required' 
            });
        }

        // Fetch Ultravox configuration to get API key for specific company
        const ultravoxConfig = await UltravoxConfiguration.findOne({
            where: { company_id: companyId },
            attributes: ['apikey']
        });

        if (!ultravoxConfig || !ultravoxConfig.apikey) {
            return res.status(404).json({ 
                error: 'Ultravox API configuration not found for the specified company' 
            });
        }

        // Prepare request options
        const options = {
            method: 'GET',
            headers: {
                'X-API-Key': ultravoxConfig.apikey,
                'Content-Type': 'application/json'
            }
        };

        // Construct URL with optional cursor and limit
        const baseUrl = 'https://api.ultravox.ai/api/voices';
        const url = new URL(baseUrl);
        if (cursor) url.searchParams.append('cursor', cursor);
        url.searchParams.append('limit', limit);

        // Add any additional filters to the URL
        Object.entries(filters).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        // Make request to Ultravox voices endpoint
        const voicesResponse = await new Promise((resolve, reject) => {
            const request = https.request(url.toString(), options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (parseError) {
                        console.error('JSON Parsing Error:', parseError);
                        console.error('Raw Response Data:', data);
                        reject(new Error('Failed to parse Ultravox API response'));
                    }
                });
            });

            request.on('error', (error) => {
                console.error('HTTPS Request Error:', error);
                reject(error);
            });

            request.end();
        });

        // Log the entire response for debugging
        console.log('Ultravox Voices Response:', JSON.stringify(voicesResponse, null, 2));

        // Validate response structure
        if (!voicesResponse || !Array.isArray(voicesResponse.results)) {
            return res.status(500).json({ 
                error: 'Invalid response from Ultravox API',
                rawResponse: voicesResponse
            });
        }

        // Respond with the list of voices and pagination info
        res.status(200).json({
            next: voicesResponse.next || null,
            previous: voicesResponse.previous || null,
            results: voicesResponse.results.map(voice => ({
                voiceId: voice.voiceId,
                name: voice.name,
                description: voice.description,
                previewUrl: voice.previewUrl,
                ownership: voice.ownership
            })),
            total: voicesResponse.total || 0
        });
    } catch (error) {
        // Log the full error for server-side debugging
        console.error('Comprehensive Error in Ultravox Voices Retrieval:', error);

        // Respond with a detailed error message
        res.status(500).json({ 
            error: 'Failed to retrieve Ultravox voices', 
            details: error.message,
            fullError: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

/**
 * Route to make a test call using Ultravox API
 */
router.post('/ultravox-test-call', async (req, res) => {
    try {
        const { 
            companyId, 
            destinationNumber,
            systemPrompt,
            voice 
        } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }

        // Fetch Twilio configuration
        const twilioConfig = await TwilioConfig.findOne({ 
            where: { company_id: companyId } 
        });

        if (!twilioConfig) {
            return res.status(404).json({ error: 'Twilio configuration not found' });
        }

        // Create Ultravox Call with optional system prompt and voice
        const { joinUrl } = await testcreateUltravoxCall(companyId, systemPrompt, voice);

        // Initiate Twilio Call
        const client = twilio(twilioConfig.account_sid, twilioConfig.auth_token);
        const call = await client.calls.create({
            twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
            to: destinationNumber || twilioConfig.phone_number,
            from: twilioConfig.phone_number
        });

        res.status(200).json({ 
            message: 'Test call initiated successfully', 
            callSid: call.sid,
            joinUrl: joinUrl 
        });
    } catch (error) {
        console.error('Error initiating test call:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
