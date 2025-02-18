# Twilio Configuration API Documentation

## Base URL
```
http://localhost:5000/api/twilio-config
```

## Authentication
All API endpoints require authentication (to be implemented).

## Endpoints

### 1. Create Twilio Configuration
Creates a new Twilio configuration for a company.

**Endpoint:** `POST /`

**Request Body:**
```json
{
	"company_id": 1,
	"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"auth_token": "your_auth_token",
	"phone_number": "+1234567890",
	"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"region": "us1",
	"api_base_url": "https://api.twilio.com"
}
```

**Response (201 Created):**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"auth_token": "your_auth_token",
		"phone_number": "+1234567890",
		"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"region": "us1",
		"api_base_url": "https://api.twilio.com",
		"created_at": "2024-03-21T10:00:00.000Z",
		"updated_at": "2024-03-21T10:00:00.000Z"
	}
}
```

### 2. Get Twilio Configuration by ID
Retrieves a specific Twilio configuration by its ID.

**Endpoint:** `GET /:id`

**Response (200 OK):**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"auth_token": "your_auth_token",
		"phone_number": "+1234567890",
		"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"region": "us1",
		"api_base_url": "https://api.twilio.com",
		"created_at": "2024-03-21T10:00:00.000Z",
		"updated_at": "2024-03-21T10:00:00.000Z"
	}
}
```

### 3. Get Twilio Configuration by Company ID
Retrieves the Twilio configuration for a specific company.

**Endpoint:** `GET /company/:companyId`

**Response (200 OK):**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"auth_token": "your_auth_token",
		"phone_number": "+1234567890",
		"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"region": "us1",
		"api_base_url": "https://api.twilio.com",
		"created_at": "2024-03-21T10:00:00.000Z",
		"updated_at": "2024-03-21T10:00:00.000Z"
	}
}
```

### 4. Update Twilio Configuration
Updates an existing Twilio configuration.

**Endpoint:** `PUT /:id`

**Request Body:**
```json
{
	"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"auth_token": "new_auth_token",
	"phone_number": "+1234567890",
	"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
	"region": "us1",
	"api_base_url": "https://api.twilio.com"
}
```

**Response (200 OK):**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"auth_token": "new_auth_token",
		"phone_number": "+1234567890",
		"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"region": "us1",
		"api_base_url": "https://api.twilio.com",
		"created_at": "2024-03-21T10:00:00.000Z",
		"updated_at": "2024-03-21T10:00:00.000Z"
	}
}
```

### 5. Delete Twilio Configuration
Deletes a Twilio configuration.

**Endpoint:** `DELETE /:id`

**Response (200 OK):**
```json
{
	"success": true,
	"message": "Twilio configuration deleted successfully"
}
```

### 6. List All Twilio Configurations
Retrieves all Twilio configurations.

**Endpoint:** `GET /`

**Response (200 OK):**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			"auth_token": "your_auth_token",
			"phone_number": "+1234567890",
			"messaging_service_sid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			"region": "us1",
			"api_base_url": "https://api.twilio.com",
			"created_at": "2024-03-21T10:00:00.000Z",
			"updated_at": "2024-03-21T10:00:00.000Z"
		}
	]
}
```

## Error Responses

### 400 Bad Request
```json
{
	"success": false,
	"message": "Validation error message"
}
```

### 404 Not Found
```json
{
	"success": false,
	"message": "Twilio configuration not found"
}
```

### 500 Internal Server Error
```json
{
	"success": false,
	"message": "Internal Server Error"
}
```



