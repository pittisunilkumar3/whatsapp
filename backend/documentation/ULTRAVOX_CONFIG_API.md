# Ultravox Configuration API Documentation

## Endpoints

### Create Ultravox Configuration
- **URL**: `/api/ultravox-config`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
	```json
	{
		"company_id": "UUID",
		"apikey": "string",
		"apiurl": "string",
		"model": "string" (optional, default: "fixie-ai/ultravox"),
		"voice": "string" (optional, default: "terrence"),
		"firstspeaker": "string" (optional, default: "FIRST_SPEAKER_USER"),
		"system_prompt": "string",
		"is_active": "boolean" (optional, default: true)
	}
	```
- **Success Response**: `201 Created`
	```json
	{
		"id": "UUID",
		"company_id": "UUID",
		"apikey": "string",
		"apiurl": "string",
		"model": "string",
		"voice": "string",
		"firstspeaker": "string",
		"system_prompt": "string",
		"is_active": boolean,
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
	```

### Get Company Configurations
- **URL**: `/api/ultravox-config/company/:companyId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
	```json
	[
		{
			"id": "UUID",
			"company_id": "UUID",
			"apikey": "string",
			"apiurl": "string",
			"model": "string",
			"voice": "string",
			"firstspeaker": "string",
			"system_prompt": "string",
			"is_active": boolean,
			"created_at": "timestamp",
			"updated_at": "timestamp"
		}
	]
	```

### Get Single Configuration
- **URL**: `/api/ultravox-config/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
	```json
	{
		"id": "UUID",
		"company_id": "UUID",
		"apikey": "string",
		"apiurl": "string",
		"model": "string",
		"voice": "string",
		"firstspeaker": "string",
		"system_prompt": "string",
		"is_active": boolean,
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
	```

### Update Configuration
- **URL**: `/api/ultravox-config/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Body**: Same as POST (all fields optional)
- **Success Response**: `200 OK`
	```json
	{
		"id": "UUID",
		"company_id": "UUID",
		"apikey": "string",
		"apiurl": "string",
		"model": "string",
		"voice": "string",
		"firstspeaker": "string",
		"system_prompt": "string",
		"is_active": boolean,
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
	```

### Delete Configuration
- **URL**: `/api/ultravox-config/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
	```json
	{
		"message": "Configuration deleted successfully"
	}
	```

## Error Responses
- **404 Not Found**
	```json
	{
		"error": "Configuration not found"
	}
	```
- **500 Internal Server Error**
	```json
	{
		"error": "Error message"
	}
	```