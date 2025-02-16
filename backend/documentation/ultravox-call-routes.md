# Ultravox Call Routes API Documentation

## Overview
The Ultravox Call Routes API provides functionality to initiate AI-powered voice calls using Twilio and Ultravox configurations stored in the database.

## Endpoint

### Initiate Ultravox Call
- **URL**: `/api/ultravox-calls/initiate-call`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | Integer | **Yes** | Unique identifier of the company whose Twilio and Ultravox configurations will be used |
| `destinationNumber` | String | No | Phone number to call. If not provided, the default phone number from Twilio configuration will be used |

### Request Example
```json
{
  "companyId": 1,
  "destinationNumber": "+919398178764"
}
```

### Successful Response
- **Status Code**: `200 OK`
- **Response Body**:
```json
{
  "message": "Call initiated successfully",
  "callSid": "CA123456789abcdef",
  "joinUrl": "https://api.ultravox.ai/call/join/unique-session-id"
}
```

### Error Responses
1. Missing Company ID
   - **Status Code**: `400 Bad Request`
   - **Response Body**:
   ```json
   {
     "error": "Company ID is required"
   }
   ```

2. Configuration Not Found
   - **Status Code**: `404 Not Found`
   - **Response Body**:
   ```json
   {
     "error": "Twilio configuration not found"
   }
   ```

3. Server Error
   - **Status Code**: `500 Internal Server Error`
   - **Response Body**:
   ```json
   {
     "error": "Detailed error message"
   }
   ```

## Configuration Requirements
To use this API, ensure the following configurations are set up in the database:

### Twilio Configuration
- `company_id`: Unique company identifier
- `account_sid`: Twilio Account SID
- `auth_token`: Twilio Auth Token
- `phone_number`: Twilio phone number for outgoing calls

### Ultravox Configuration
- `company_id`: Matching company identifier
- `apikey`: Ultravox API Key
- `apiurl`: Ultravox API endpoint
- `system_prompt`: AI agent's system prompt
- `model`: AI model (default: 'fixie-ai/ultravox')
- `voice`: Voice type (default: 'terrence')
- `firstspeaker`: First speaker configuration (default: 'FIRST_SPEAKER_USER')

## Security Considerations
- Always keep Twilio and Ultravox API credentials secure
- Use environment variables or secure configuration management
- Implement proper authentication and authorization before calling this API

## Potential Use Cases
- Automated customer support calls
- Appointment reminders
- Sales and marketing outreach
- Personalized AI-driven communication

## Troubleshooting
- Verify database configurations
- Check Twilio and Ultravox API credentials
- Ensure network connectivity to external APIs
- Monitor server logs for detailed error information
