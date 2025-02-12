# Call Campaign API Documentation

## Overview
This API provides endpoints for managing call campaigns in the WhatsApp CRM system. It allows creating, retrieving, updating, and deleting call campaigns, as well as managing their statuses.

## Base URL
```
/api/callagent/campaigns
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### Create Campaign
**POST /** 

Creates a new call campaign.

**Request Body:**
```json
{
	"company_id": "integer (required)",
	"campaign_name": "string (required)",
	"description": "string",
	"caller_id": "string (max 20 chars)",
	"voice_script": "string",
	"call_duration": "integer",
	"call_schedule_start": "time (HH:MM:SS)",
	"call_schedule_end": "time (HH:MM:SS)",
	"call_frequency": "enum('Daily', 'Weekly', 'Monthly')",
	"budget": "decimal",
	"currency": "string (3 chars)",
	"target_audience": "string"
}
```

**Response:** `201 Created`
```json
{
	"message": "Call campaign created successfully",
	"data": {
		"campaign_id": "integer",
		"created_at": "timestamp"
	}
}
```

### List Campaigns
**GET /**

Retrieves all call campaigns with optional filtering.

**Query Parameters:**
- company_id (optional): Filter by company ID
- is_active (optional): Filter by active status (true/false)
- completion_status (optional): Filter by status ('In Progress', 'Completed', 'Not Started')

**Response:** `200 OK`
```json
[
	{
		"campaign_id": "integer",
		"company_id": "integer",
		"campaign_name": "string",
		"description": "string",
		"caller_id": "string",
		"voice_script": "string",
		"call_duration": "integer",
		"call_schedule_start": "time",
		"call_schedule_end": "time",
		"call_frequency": "string",
		"is_active": "boolean",
		"budget": "decimal",
		"currency": "string",
		"target_audience": "string",
		"completion_status": "string",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
]
```

### Get Campaign
**GET /:campaignId**

Retrieves a specific campaign by ID.

**Response:** `200 OK`
```json
{
	"campaign_id": "integer",
	"company_id": "integer",
	"campaign_name": "string",
	"description": "string",
	"caller_id": "string",
	"voice_script": "string",
	"call_duration": "integer",
	"call_schedule_start": "time",
	"call_schedule_end": "time",
	"call_frequency": "string",
	"is_active": "boolean",
	"budget": "decimal",
	"currency": "string",
	"target_audience": "string",
	"completion_status": "string",
	"created_at": "timestamp",
	"updated_at": "timestamp"
}
```

### Update Campaign
**PUT /:campaignId**

Updates an existing campaign.

**Request Body:** Same as Create Campaign

**Response:** `200 OK`
```json
{
	"message": "Call campaign updated successfully"
}
```

### Delete Campaign
**DELETE /:campaignId**

Deletes a campaign.

**Response:** `200 OK`
```json
{
	"message": "Call campaign deleted successfully"
}
```

### Update Campaign Status
**PUT /:campaignId/status**

Updates the completion status of a campaign.

**Request Body:**
```json
{
	"status": "enum('In Progress', 'Completed', 'Not Started')"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call campaign status updated successfully"
}
```

### Toggle Campaign Active Status
**PUT /:campaignId/active**

Toggles the active status of a campaign.

**Request Body:**
```json
{
	"is_active": "boolean"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call campaign active status updated successfully"
}
```

## Error Responses

### 404 Not Found
```json
{
	"message": "Call campaign not found"
}
```

### 500 Internal Server Error
```json
{
	"message": "Error message description",
	"error": "Detailed error information"
}
```

## Notes
- All timestamps are in UTC
- Currency codes should follow ISO 4217 format (e.g., USD, EUR)
- Time values should be in 24-hour format (HH:MM:SS)