# SuperAdmin API Documentation

## Endpoints

### Create SuperAdmin
- **URL**: `/api/superadmin`
- **Method**: `POST`
- **Body**:
	```json
	{
		"first_name": "string",
		"last_name": "string",
		"username": "string",
		"email": "string",
		"password": "string",
		"phone_number": "string (optional)",
		"country_code": "string (optional)"
	}
	```
- **Response**: 201 Created
	```json
	{
		"message": "SuperAdmin created successfully",
		"id": "number"
	}
	```

### Get SuperAdmin
- **URL**: `/api/superadmin/:id`
- **Method**: `GET`
- **Response**: 200 OK
	```json
	{
		"id": "number",
		"first_name": "string",
		"last_name": "string",
		"username": "string",
		"email": "string",
		"phone_number": "string",
		"country_code": "string",
		"is_active": "boolean",
		"last_login": "timestamp",
		"created_at": "timestamp",
		"updated_at": "timestamp"
	}
	```

### Update SuperAdmin
- **URL**: `/api/superadmin/:id`
- **Method**: `PUT`
- **Body**: Any of the following fields
	```json
	{
		"first_name": "string",
		"last_name": "string",
		"username": "string",
		"email": "string",
		"password": "string",
		"phone_number": "string",
		"country_code": "string",
		"is_active": "boolean"
	}
	```
- **Response**: 200 OK
	```json
	{
		"message": "SuperAdmin updated successfully"
	}
	```

### Delete SuperAdmin
- **URL**: `/api/superadmin/:id`
- **Method**: `DELETE`
- **Response**: 200 OK
	```json
	{
		"message": "SuperAdmin deleted successfully"
	}
	```

### Login
- **URL**: `/api/superadmin/login`
- **Method**: `POST`
- **Body**:
	```json
	{
		"email": "string",
		"password": "string"
	}
	```
- **Response**: 200 OK
	```json
	{
		"success": true,
		"message": "Login successful",
		"data": {
			"id": "number",
			"first_name": "string",
			"last_name": "string",
			"username": "string",
			"email": "string",
			"phone_number": "string",
			"country_code": "string",
			"is_active": "boolean",
			"last_login": "timestamp",
			"created_at": "timestamp",
			"updated_at": "timestamp"
		}
	}
	```

## Error Responses
- **400 Bad Request**: When request validation fails
- **401 Unauthorized**: When login credentials are invalid
- **404 Not Found**: When SuperAdmin is not found
- **500 Internal Server Error**: When server encounters an error