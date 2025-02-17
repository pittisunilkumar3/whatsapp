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

## Sequential Bulk Calls Route

#### `POST /bulk-calls-sequential`

Initiate multiple Ultravox calls sequentially using an array of phone numbers.

**Request Parameters:**
- `companyId` (required): The ID of the company for which the calls will be initiated
- `phoneNumbers` (required): An array of phone numbers to call
- `twimlUrl` (optional): Custom TwiML URL for call handling (defaults to Twilio demo)

**Request Example:**
```bash
curl -X POST /bulk-calls-sequential \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 123,
    "phoneNumbers": [
      "+1234567890",
      "+0987654321",
      "+918123456789"
    ]
  }'
```

**Response Structure:**
```json
{
  "message": "Bulk calls processed sequentially",
  "totalCalls": 3,
  "callResults": [
    {
      "phoneNumber": "+1234567890",
      "status": "initiated",
      "callSid": "CA123...",
      "joinUrl": "https://ultravox.call/join/123"
    },
    {
      "phoneNumber": "+0987654321",
      "status": "completed",
      "callSid": "CA456...",
      "joinUrl": "https://ultravox.call/join/456"
    }
  ]
}
```

**Processing Behavior:**
- Calls are processed strictly one at a time
- Each call is monitored until completion
- Next call starts only after the previous call finishes
- Detailed results are tracked for each call
- Failed calls do not necessarily stop the entire sequence

**Ultravox Integration:**
- Creates a unique Ultravox call configuration for each phone number
- Uses company-specific Ultravox settings
- Connects each call to an Ultravox stream
- Supports dynamic system prompts and voice configurations

**Error Handling:**
- Validates company ID and phone numbers
- Checks Twilio and Ultravox configurations
- Provides comprehensive error reporting
- Continues processing remaining numbers if a call fails

**Key Features:**
- Sequential call processing
- Company-specific configuration
- Detailed call tracking
- Flexible Ultravox integration
- Robust error management

**Potential Use Cases:**
- Automated notification systems
- Sequential customer outreach
- Compliance-driven communication
- AI-powered bulk communication workflows

**Performance Considerations:**
- Slower processing due to sequential nature
- Ensures complete processing of each call
- Minimal concurrent resource usage
- Ideal for scenarios requiring strict call order

**Troubleshooting:**
- Verify Twilio and Ultravox configurations
- Check network connectivity
- Monitor server logs
- Ensure valid phone numbers
- Verify company-specific settings

## Best Practices for Bulk Calls
1. Start with a small number of concurrent calls
2. Monitor system performance and adjust `maxConcurrentCalls`
3. Implement proper error handling in your client application
4. Ensure all destination numbers are valid before submission
5. Consider time zones and call timing regulations

## Best Practices for Intelligent Bulk Calls
1. Start with conservative concurrent call and duration settings
2. Monitor system performance and adjust parameters
3. Implement additional error handling in your client application
4. Ensure robust network connectivity
5. Consider time zones and call timing regulations

### Error Handling
- Calls that exceed `maxCallDuration` are automatically terminated
- Failed calls are tracked and reported separately
- Ongoing calls continue to be monitored until completion or timeout

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
