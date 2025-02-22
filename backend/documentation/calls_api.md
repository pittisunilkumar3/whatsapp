# Voice Calls API Documentation

## Overview
The Voice Calls API provides endpoints for managing voice call records in the system. It allows you to create, retrieve, list, and delete call records associated with companies, campaigns, and leads. This API specifically handles voice calls using the `voice_calls` table, separate from the callagent system.

## Base URL
```
/api/voice-calls
```

## Authentication
All endpoints require authentication. Include your API token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Create Voice Call Record
Creates a new voice call record in the system.

**URL**: `/api/voice-calls/:companyId/campaigns/:campaignId/calls`  
**Method**: `POST`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| campaignId | Number | ID of the campaign |

#### Request Body
```json
{
    "callId": "ultravox_123",
    "callsid": "twilio_456",
    "leadid": 789,
    "call_status": "initiated",
    "call_duration": 0,
    "recording_url": null,
    "call_data": {
        "direction": "outbound",
        "from": "+1234567890",
        "to": "+9876543210",
        "custom_params": {}
    }
}
```

#### Success Response
**Code**: `201 Created`
```json
{
    "id": 1,
    "message": "Voice call record created successfully"
}
```

### Get Voice Call by ID
Retrieves a specific voice call record by its ID.

**URL**: `/api/voice-calls/:companyId/calls/:id`  
**Method**: `GET`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| id | Number | ID of the call record |

#### Success Response
**Code**: `200 OK`
```json
{
    "id": 1,
    "company_id": 1,
    "campaign_id": 1,
    "lead_id": 789,
    "call_id": "ultravox_123",
    "call_sid": "twilio_456",
    "call_status": "completed",
    "call_duration": 300,
    "recording_url": "https://api.twilio.com/recordings/RE123",
    "call_data": {
        "direction": "outbound",
        "from": "+1234567890",
        "to": "+9876543210",
        "custom_params": {}
    },
    "is_active": true,
    "created_at": "2024-02-23T10:30:00Z",
    "updated_at": "2024-02-23T10:35:00Z"
}
```

### Get Voice Calls by Lead
Retrieves all voice calls for a specific lead.

**URL**: `/api/voice-calls/:companyId/leads/:leadid/calls`  
**Method**: `GET`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| leadid | Number | ID of the lead |

#### Success Response
**Code**: `200 OK`
```json
[
    {
        "id": 1,
        "company_id": 1,
        "campaign_id": 1,
        "lead_id": 789,
        "call_id": "ultravox_123",
        "call_sid": "twilio_456",
        "call_status": "completed",
        "call_duration": 300,
        "recording_url": "https://api.twilio.com/recordings/RE123",
        "call_data": {
            "direction": "outbound",
            "from": "+1234567890",
            "to": "+9876543210",
            "custom_params": {}
        },
        "is_active": true,
        "created_at": "2024-02-23T10:30:00Z",
        "updated_at": "2024-02-23T10:35:00Z"
    }
]
```

### List Campaign Calls
Retrieves all voice calls for a specific campaign.

**URL**: `/api/voice-calls/:companyId/campaigns/:campaignId/calls`  
**Method**: `GET`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| campaignId | Number | ID of the campaign |

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | Number | Page number | 1 |
| limit | Number | Items per page | 10 |

### List Lead Calls
Retrieves all voice calls for a specific lead.

**URL**: `/api/voice-calls/:companyId/leads/:leadid/calls`  
**Method**: `GET`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| leadid | Number | ID of the lead |

### Update Voice Call
Updates a voice call record.

**URL**: `/api/voice-calls/:companyId/calls/:id`  
**Method**: `PUT`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| id | Number | ID of the call record |

### Delete Voice Call
Soft deletes a voice call record.

**URL**: `/api/voice-calls/:companyId/calls/:id`  
**Method**: `DELETE`  
**Auth required**: Yes

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| companyId | Number | ID of the company |
| id | Number | ID of the call record |

## Error Responses

### Not Found
**Code**: `404 Not Found`
```json
{
    "message": "Call not found"
}
```

### Invalid Request
**Code**: `400 Bad Request`
```json
{
    "message": "Error creating call",
    "error": "Invalid request parameters"
}
```

### Server Error
**Code**: `500 Internal Server Error`
```json
{
    "message": "Error creating call",
    "error": "Database error description"
}
```

## Important Notes

1. The `call_data` field is stored as a JSON column in the database and supports any valid JSON object. Common fields include:
   - `direction`: String (inbound/outbound)
   - `from`: String (E.164 format phone number)
   - `to`: String (E.164 format phone number)
   - `custom_params`: Object (for any additional metadata)

2. Phone numbers should be in E.164 format (e.g., "+1234567890")

3. The `call_status` field accepts only the following values:
   - `initiated`
   - `ringing`
   - `in-progress`
   - `completed`
   - `busy`
   - `failed`
   - `no-answer`
   - `cancelled`

## Field Descriptions

### Call Status Values
The `call_status` field accepts only the following values:
- `initiated`: Call has been initiated
- `ringing`: Call is ringing
- `in-progress`: Call is in progress
- `completed`: Call completed successfully
- `busy`: Recipient was busy
- `failed`: Call failed
- `no-answer`: Call was not answered
- `cancelled`: Call was cancelled

### Call Data Object
The `call_data` field is a JSON object that typically includes:
- `direction`: String (inbound/outbound)
- `from`: String (E.164 format phone number, e.g., "+1234567890")
- `to`: String (E.164 format phone number)
- `custom_params`: Object (for any additional metadata)
