# Call API Documentation

## Base URL
`http://localhost:5000/api/callagent/calls`

## Endpoints

### Create Call Record
- **URL**: `/`
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
```json
{
	"message": "Call record created successfully",
	"data": {
		"id": 1,
		"call_lead_id": 1,
		"call_agent_id": 1,
		"call_duration": 120,
		"call_outcome": "Success"
	}
}
```

### Get All Calls
- **URL**: `/`
- **Method**: `GET`
- **Query Parameters**:
  - `company_id`: Filter by company
  - `call_agent_id`: Filter by agent
  - `call_lead_id`: Filter by lead
  - `call_type`: Filter by type
  - `call_outcome`: Filter by outcome
- **Success Response**: `200 OK`
```json
{
	"data": [
		{
			"call_id": 1,
			"company_id": 1,
			"call_lead_id": 1,
			"call_agent_id": 1,
			"call_duration": 120,
			"call_outcome": "Success"
		}
	]
}
```

### Get Call by ID
- **URL**: `/:callId`
- **Method**: `GET`
- **URL Parameters**: `callId=[integer]`
- **Success Response**: `200 OK`
```json
{
	"data": {
		"call_id": 1,
		"company_id": 1,
		"call_lead_id": 1,
		"call_agent_id": 1,
		"call_duration": 120,
		"call_outcome": "Success"
	}
}
```

### Update Call
- **URL**: `/:callId`
- **Method**: `PUT`
- **URL Parameters**: `callId=[integer]`
- **Body**: Same as Create
- **Success Response**: `200 OK`
```json
{
	"message": "Call record updated successfully"
}
```

### Delete Call
- **URL**: `/:callId`
- **Method**: `DELETE`
- **URL Parameters**: `callId=[integer]`
- **Success Response**: `200 OK`
```json
{
	"message": "Call record deleted successfully"
}
```

### Update Call Outcome
- **URL**: `/:callId/outcome`
- **Method**: `PUT`
- **URL Parameters**: `callId=[integer]`
- **Body**:
```json
{
	"outcome": "enum('Success', 'No Answer', 'Voicemail', 'Wrong Number')"
}
```
- **Success Response**: `200 OK`
```json
{
	"message": "Call outcome updated successfully"
}
```

### Schedule Follow-up
- **URL**: `/:callId/follow-up`
- **Method**: `PUT`
- **URL Parameters**: `callId=[integer]`
- **Body**:
```json
{
	"follow_up_date": "date",
	"follow_up_time": "time"
}
```
- **Success Response**: `200 OK`
```json
{
	"message": "Follow-up scheduled successfully"
}
```

## Error Responses
All endpoints may return these errors:
- **400**: Bad Request - Invalid input data
- **404**: Not Found - Call record not found
- **500**: Internal Server Error

Example error response:
```json
{
	"message": "Error message here",
	"error": "Detailed error information"
}
```