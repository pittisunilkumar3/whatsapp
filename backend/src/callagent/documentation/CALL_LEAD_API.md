# Call Lead API Documentation

## Overview
This API provides endpoints for managing call leads in the WhatsApp CRM system. It enables creating, retrieving, updating, and managing leads associated with call campaigns.

## Base URL
```
/api/callagent/leads
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### Create Lead
**POST /**

Creates a new call lead.

**Request Body:**
```json
{
	"company_id": "integer (required)",
	"first_name": "string",
	"last_name": "string",
	"phone_number": "string (required, max 20 chars)",
	"email": "string",
	"address": "string",
	"campaign_id": "integer",
	"lead_status": "enum('New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up Scheduled', 'Closed')",
	"lead_score": "integer",
	"source": "string",
	"assigned_agent_id": "integer"
}
```

**Response:** `201 Created`
```json
{
	"message": "Call lead created successfully",
	"data": {
		"lead_id": "integer",
		"created_at": "timestamp"
	}
}
```

### List Leads
**GET /**

Retrieves all call leads with optional filtering.

**Query Parameters:**
- company_id (optional): Filter by company ID
- campaign_id (optional): Filter by campaign ID
- assigned_agent_id (optional): Filter by assigned agent
- is_active (optional): Filter by active status (true/false)
- lead_status (optional): Filter by lead status

**Response:** `200 OK`
```json
[
	{
		"lead_id": "integer",
		"company_id": "integer",
		"first_name": "string",
		"last_name": "string",
		"phone_number": "string",
		"email": "string",
		"address": "string",
		"campaign_id": "integer",
		"lead_status": "string",
		"lead_score": "integer",
		"lead_score_updated_at": "timestamp",
		"is_active": "boolean",
		"source": "string",
		"assigned_agent_id": "integer",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
]
```

### Get Lead
**GET /:leadId**

Retrieves a specific lead by ID.

**Response:** `200 OK`
```json
{
	"lead_id": "integer",
	"company_id": "integer",
	"first_name": "string",
	"last_name": "string",
	"phone_number": "string",
	"email": "string",
	"address": "string",
	"campaign_id": "integer",
	"lead_status": "string",
	"lead_score": "integer",
	"lead_score_updated_at": "timestamp",
	"is_active": "boolean",
	"source": "string",
	"assigned_agent_id": "integer",
	"created_at": "timestamp",
	"updated_at": "timestamp"
}
```

### Get Company Leads
**GET /company/:companyId**

Retrieves all leads for a specific company.

**Response:** `200 OK`
```json
[
	{
		"lead_id": "integer",
		"first_name": "string",
		"last_name": "string",
		"phone_number": "string",
		"email": "string",
		"lead_status": "string",
		"lead_score": "integer"
	}
]
```

### Get Campaign Leads
**GET /campaign/:campaignId**

Retrieves all leads for a specific campaign.

**Response:** `200 OK`
```json
[
	{
		"lead_id": "integer",
		"first_name": "string",
		"last_name": "string",
		"phone_number": "string",
		"email": "string",
		"lead_status": "string",
		"lead_score": "integer"
	}
]
```

### Update Lead
**PUT /:leadId**

Updates an existing lead.

**Request Body:** Same as Create Lead

**Response:** `200 OK`
```json
{
	"message": "Call lead updated successfully"
}
```

### Delete Lead
**DELETE /:leadId**

Deletes a lead.

**Response:** `200 OK`
```json
{
	"message": "Call lead deleted successfully"
}
```

### Update Lead Status
**PUT /:leadId/status**

Updates the status of a lead.

**Request Body:**
```json
{
	"status": "enum('New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up Scheduled', 'Closed')"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call lead status updated successfully"
}
```

### Update Lead Score
**PUT /:leadId/score**

Updates the score of a lead.

**Request Body:**
```json
{
	"score": "integer"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call lead score updated successfully"
}
```

## Error Responses

### 404 Not Found
```json
{
	"message": "Call lead not found"
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
- Phone numbers should be in international format
- Lead scores typically range from 0 to 100
- Email addresses must be valid format