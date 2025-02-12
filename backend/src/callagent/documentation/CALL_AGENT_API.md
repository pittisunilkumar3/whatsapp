# Call Agent API Documentation

## Overview
This API provides endpoints for managing call agents in the WhatsApp CRM system. It enables creating, retrieving, updating, and managing call center agents.

## Base URL
```
/api/callagent/agents
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### Create Agent
**POST /**

Creates a new call agent.

**Request Body:**
```json
{
	"company_id": "integer (required)",
	"agent_name": "string (required)",
	"agent_phone": "string (max 20 chars)",
	"email": "string",
	"performance_metrics": "json",
	"hire_date": "date",
	"department": "string",
	"role": "string"
}
```

**Response:** `201 Created`
```json
{
	"message": "Call agent created successfully",
	"data": {
		"agent_id": "integer",
		"created_at": "timestamp"
	}
}
```

### List Agents
**GET /**

Retrieves all call agents with optional filtering.

**Query Parameters:**
- company_id (optional): Filter by company ID
- is_active (optional): Filter by active status (true/false)

**Response:** `200 OK`
```json
[
	{
		"agent_id": "integer",
		"company_id": "integer",
		"agent_name": "string",
		"agent_phone": "string",
		"email": "string",
		"performance_metrics": "json",
		"is_active": "boolean",
		"hire_date": "date",
		"department": "string",
		"role": "string",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
]
```

### Get Agent
**GET /:agentId**

Retrieves a specific agent by ID.

**Response:** `200 OK`
```json
{
	"agent_id": "integer",
	"company_id": "integer",
	"agent_name": "string",
	"agent_phone": "string",
	"email": "string",
	"performance_metrics": "json",
	"is_active": "boolean",
	"hire_date": "date",
	"department": "string",
	"role": "string",
	"created_at": "timestamp",
	"updated_at": "timestamp"
}
```

### Get Company Agents
**GET /company/:companyId**

Retrieves all agents for a specific company.

**Response:** `200 OK`
```json
[
	{
		"agent_id": "integer",
		"agent_name": "string",
		"agent_phone": "string",
		"email": "string",
		"is_active": "boolean",
		"role": "string"
	}
]
```

### Update Agent
**PUT /:agentId**

Updates an existing agent.

**Request Body:** Same as Create Agent

**Response:** `200 OK`
```json
{
	"message": "Call agent updated successfully"
}
```

### Delete Agent
**DELETE /:agentId**

Deletes an agent.

**Response:** `200 OK`
```json
{
	"message": "Call agent deleted successfully"
}
```

### Toggle Agent Active Status
**PUT /:agentId/active**

Toggles the active status of an agent.

**Request Body:**
```json
{
	"is_active": "boolean"
}
```

**Response:** `200 OK`
```json
{
	"message": "Call agent active status updated successfully"
}
```

## Error Responses

### 404 Not Found
```json
{
	"message": "Call agent not found"
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
- Performance metrics should be a valid JSON object
- Email addresses must be valid format
- Hire date should be in YYYY-MM-DD format
```

#### Create Campaign
- **URL**: `/campaigns`
- **Method**: `POST`
- **Body**:
```json
{
	"company_id": "integer",
	"campaign_name": "string",
	"description": "string",
	"caller_id": "string",
	"voice_script": "string",
	"call_duration": "integer",
	"call_schedule_start": "time",
	"call_schedule_end": "time",
	"call_frequency": "enum('Daily', 'Weekly', 'Monthly')",
	"budget": "decimal",
	"currency": "string",
	"target_audience": "string"
}
```
- **Success Response**: `201 Created`

#### Get All Campaigns
- **URL**: `/campaigns`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `is_active`: Filter by active status
  - `completion_status`: Filter by completion status
- **Success Response**: `200 OK`

#### Get Campaign by ID
- **URL**: `/campaigns/:campaignId`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Campaign
- **URL**: `/campaigns/:campaignId`
- **Method**: `PUT`
- **Body**: Same as Create
- **Success Response**: `200 OK`

#### Delete Campaign
- **URL**: `/campaigns/:campaignId`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

### Call Agents

#### Create Agent
- **URL**: `/agents`
- **Method**: `POST`
- **Body**:
```json
{
	"company_id": "integer",
	"agent_name": "string",
	"agent_phone": "string",
	"email": "string",
	"performance_metrics": "json",
	"hire_date": "date",
	"department": "string",
	"role": "string"
}
```
- **Success Response**: `201 Created`

#### Get All Agents
- **URL**: `/agents`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `is_active`: Filter by active status
- **Success Response**: `200 OK`

#### Get Agent by ID
- **URL**: `/agents/:agentId`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Agent
- **URL**: `/agents/:agentId`
- **Method**: `PUT`
- **Body**: Same as Create
- **Success Response**: `200 OK`

#### Delete Agent
- **URL**: `/agents/:agentId`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

### Call Leads

#### Create Lead
- **URL**: `/leads`
- **Method**: `POST`
- **Body**:
```json
{
	"company_id": "integer",
	"first_name": "string",
	"last_name": "string",
	"phone_number": "string",
	"email": "string",
	"address": "string",
	"campaign_id": "integer",
	"lead_status": "enum('New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up Scheduled', 'Closed')",
	"source": "string",
	"assigned_agent_id": "integer"
}
```
- **Success Response**: `201 Created`

#### Get All Leads
- **URL**: `/leads`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `campaign_id`: Filter by campaign
  - `assigned_agent_id`: Filter by agent
  - `lead_status`: Filter by status
- **Success Response**: `200 OK`

#### Get Lead by ID
- **URL**: `/leads/:leadId`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Lead
- **URL**: `/leads/:leadId`
- **Method**: `PUT`
- **Body**: Same as Create
- **Success Response**: `200 OK`

#### Delete Lead
- **URL**: `/leads/:leadId`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

### Calls

#### Create Call Record
- **URL**: `/calls`
- **Method**: `POST`
- **Body**:
```json
{
	"company_id": "integer",
	"call_lead_id": "integer",
	"call_agent_id": "integer",
	"call_duration": "integer",
	"call_outcome": "enum('Success', 'No Answer', 'Voicemail', 'Wrong Number')",
	"notes": "string",
	"follow_up_date": "date",
	"follow_up_time": "time",
	"recording_url": "string",
	"call_type": "enum('Inbound', 'Outbound')"
}
```
- **Success Response**: `201 Created`

#### Get All Calls
- **URL**: `/calls`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `call_agent_id`: Filter by agent
  - `call_lead_id`: Filter by lead
  - `call_type`: Filter by type
  - `call_outcome`: Filter by outcome
- **Success Response**: `200 OK`

#### Get Call by ID
- **URL**: `/calls/:callId`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Call
- **URL**: `/calls/:callId`
- **Method**: `PUT`
- **Body**: Same as Create
- **Success Response**: `200 OK`

#### Delete Call
- **URL**: `/calls/:callId`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

### Call Reports

#### Create Report
- **URL**: `/reports`
- **Method**: `POST`
- **Body**:
```json
{
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
	"report_type": "enum('Daily', 'Weekly', 'Monthly')"
}
```
- **Success Response**: `201 Created`

#### Get All Reports
- **URL**: `/reports`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `campaign_id`: Filter by campaign
  - `report_type`: Filter by type
  - `report_date`: Filter by date
- **Success Response**: `200 OK`

#### Get Report by ID
- **URL**: `/reports/:reportId`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Report
- **URL**: `/reports/:reportId`
- **Method**: `PUT`
- **Body**: Same as Create
- **Success Response**: `200 OK`

#### Delete Report
- **URL**: `/reports/:reportId`
- **Method**: `DELETE`
- **Success Response**: `200 OK`

## Error Responses
All endpoints may return these errors:
- **400**: Bad Request - Invalid input data
- **404**: Not Found - Resource not found
- **500**: Internal Server Error

Example error response:
```json
{
	"message": "Error message here",
	"error": "Detailed error information"
}
```