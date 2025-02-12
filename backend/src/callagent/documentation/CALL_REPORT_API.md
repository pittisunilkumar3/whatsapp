# Call Report API Documentation

## Overview
This API provides endpoints for managing call reports in the WhatsApp CRM system. It enables creating, retrieving, and analyzing call campaign performance reports.

## Base URL
```
/api/callagent/reports
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### Create Report
**POST /**

Creates a new call report.

**Request Body:**
```json
{
	"company_id": "integer (required)",
	"campaign_id": "integer",
	"total_calls": "integer",
	"successful_calls": "integer",
	"unsuccessful_calls": "integer",
	"avg_call_duration": "integer",
	"agent_performance": "json",
	"report_date": "date",
	"report_period_start": "date",
	"report_period_end": "date",
	"report_type": "enum('Daily', 'Weekly', 'Monthly')"
}
```

**Response:** `201 Created`
```json
{
	"message": "Call report created successfully",
	"data": {
		"report_id": "integer",
		"created_at": "timestamp"
	}
}
```

### List Reports
**GET /**

Retrieves all call reports with optional filtering.

**Query Parameters:**
- company_id (optional): Filter by company ID
- campaign_id (optional): Filter by campaign ID
- report_date (optional): Filter by specific date
- report_type (optional): Filter by report type
- is_active (optional): Filter by active status (true/false)

**Response:** `200 OK`
```json
[
	{
		"report_id": "integer",
		"company_id": "integer",
		"campaign_id": "integer",
		"total_calls": "integer",
		"successful_calls": "integer",
		"unsuccessful_calls": "integer",
		"avg_call_duration": "integer",
		"agent_performance": "json",
		"report_date": "date",
		"report_period_start": "date",
		"report_period_end": "date",
		"is_active": "boolean",
		"report_type": "string",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
]
```

### Get Report
**GET /:reportId**

Retrieves a specific report by ID.

**Response:** `200 OK`
```json
{
	"report_id": "integer",
	"company_id": "integer",
	"campaign_id": "integer",
	"total_calls": "integer",
	"successful_calls": "integer",
	"unsuccessful_calls": "integer",
	"avg_call_duration": "integer",
	"agent_performance": "json",
	"report_date": "date",
	"report_period_start": "date",
	"report_period_end": "date",
	"is_active": "boolean",
	"report_type": "string",
	"created_at": "timestamp",
	"updated_at": "timestamp"
}
```

### Get Company Reports
**GET /company/:companyId**

Retrieves all reports for a specific company.

**Response:** `200 OK`
```json
[
	{
		"report_id": "integer",
		"campaign_id": "integer",
		"total_calls": "integer",
		"successful_calls": "integer",
		"report_date": "date",
		"report_type": "string"
	}
]
```

### Get Campaign Reports
**GET /campaign/:campaignId**

Retrieves all reports for a specific campaign.

**Response:** `200 OK`
```json
[
	{
		"report_id": "integer",
		"total_calls": "integer",
		"successful_calls": "integer",
		"avg_call_duration": "integer",
		"report_date": "date",
		"report_type": "string"
	}
]
```

### Update Report
**PUT /:reportId**

Updates an existing report.

**Request Body:** Same as Create Report

**Response:** `200 OK`
```json
{
	"message": "Call report updated successfully"
}
```

### Delete Report
**DELETE /:reportId**

Deletes a report.

**Response:** `200 OK`
```json
{
	"message": "Call report deleted successfully"
}
```

### Toggle Report Active Status
**PUT /:reportId/active**

Toggles the active status of a report.

**Request Body:**
```json
{
	"is_active": "boolean"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call report active status updated successfully"
}
```

## Error Responses

### 404 Not Found
```json
{
	"message": "Call report not found"
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
- Dates should be in YYYY-MM-DD format
- Agent performance should be a valid JSON object containing metrics
- Call durations are measured in seconds