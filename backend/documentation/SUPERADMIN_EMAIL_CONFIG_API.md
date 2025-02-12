# SuperAdmin Email Configuration API Documentation

## Base URL
`http://localhost:5000/api/superadmin/email-config`

## Endpoints

### Get All Email Configurations
- **URL**: `/`
- **Method**: `GET`
- **Success Response Code**: 200
- **Success Response Body**:
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"email_type": "smtp",
			"smtp_server": "smtp.example.com",
			"smtp_port": "587",
			"smtp_username": "user@example.com",
			"smtp_password": "password",
			"ssl_tls": "tls",
			"smtp_auth": "yes",
			"api_key": "api_key_here",
			"api_secret": "api_secret_here",
			"region": "us-east-1",
			"is_active": "yes",
			"created_at": "2024-03-21T10:00:00.000Z"
		}
	]
}
```

### Get Email Configuration by ID
- **URL**: `/:id`
- **Method**: `GET`
- **URL Params**: `id=[integer]`
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found
- **Success Response Body**:
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"email_type": "smtp",
		"smtp_server": "smtp.example.com",
		"smtp_port": "587",
		"smtp_username": "user@example.com",
		"smtp_password": "password",
		"ssl_tls": "tls",
		"smtp_auth": "yes",
		"api_key": "api_key_here",
		"api_secret": "api_secret_here",
		"region": "us-east-1",
		"is_active": "yes",
		"created_at": "2024-03-21T10:00:00.000Z"
	}
}
```

### Create Email Configuration
- **URL**: `/`
- **Method**: `POST`
- **Body**:
```json
{
	"company_id": 1,
	"email_type": "smtp",
	"smtp_server": "smtp.example.com",
	"smtp_port": "587",
	"smtp_username": "user@example.com",
	"smtp_password": "password",
	"ssl_tls": "tls",
	"smtp_auth": "yes",
	"api_key": "api_key_here",
	"api_secret": "api_secret_here",
	"region": "us-east-1",
	"is_active": "yes"
}
```
- **Success Response Code**: 201
- **Success Response Body**:
```json
{
	"success": true,
	"message": "Email configuration created successfully",
	"data": {
		"id": 1
	}
}
```

### Update Email Configuration
- **URL**: `/:id`
- **Method**: `PUT`
- **URL Params**: `id=[integer]`
- **Body**: Same as Create
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found
- **Success Response Body**:
```json
{
	"success": true,
	"message": "Email configuration updated successfully"
}
```

### Delete Email Configuration
- **URL**: `/:id`
- **Method**: `DELETE`
- **URL Params**: `id=[integer]`
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found
- **Success Response Body**:
```json
{
	"success": true,
	"message": "Email configuration deleted successfully"
}
```

## Error Responses
All endpoints may return these errors:
- **400**: Bad Request - Invalid input data
- **404**: Not Found - Resource not found
- **500**: Internal Server Error

Example error response:
```json
{
	"success": false,
	"message": "Error message here"
}
```

## Endpoints

### Get All Email Configurations
- **URL**: `/api/superadmin-email-config`
- **Method**: GET
- **Response**: List of all email configurations
- **Success Response Code**: 200

### Get Email Configuration by ID
- **URL**: `/api/superadmin-email-config/:id`
- **Method**: GET
- **URL Params**: id=[integer]
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

### Create Email Configuration
- **URL**: `/api/superadmin-email-config`
- **Method**: POST
- **Body**:
```json
{
	"email_type": "string",
	"smtp_server": "string",
	"smtp_port": "string",
	"smtp_username": "string",
	"smtp_password": "string",
	"ssl_tls": "string",
	"smtp_auth": "string",
	"api_key": "string",
	"api_secret": "string",
	"region": "string",
	"is_active": "string"
}
```
- **Success Response Code**: 201

### Update Email Configuration
- **URL**: `/api/superadmin-email-config/:id`
- **Method**: PUT
- **URL Params**: id=[integer]
- **Body**: Same as Create
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

### Delete Email Configuration
- **URL**: `/api/superadmin-email-config/:id`
- **Method**: DELETE
- **URL Params**: id=[integer]
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

## Error Responses
All endpoints may return these errors:
- **500**: Internal Server Error