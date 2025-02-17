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

module.exports = router;
