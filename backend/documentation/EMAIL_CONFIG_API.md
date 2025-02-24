# Email Configuration API Documentation

## Endpoints

### Get All Email Configurations
- **URL**: `/api/email-config`
- **Method**: GET
- **Response**: List of all email configurations with company details
- **Success Response Code**: 200

### Get Email Configurations by Company ID
- **URL**: `/api/email-config/company/:companyId`
- **Method**: GET
- **URL Params**: companyId=[integer]
- **Response**: List of email configurations for the specified company
- **Success Response Code**: 200

### Get Email Configuration by ID
- **URL**: `/api/email-config/:id`
- **Method**: GET
- **URL Params**: id=[integer]
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

### Create Email Configuration
- **URL**: `/api/email-config`
- **Method**: POST
- **Body**:
```json
{
	"company_id": "integer",
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
- **URL**: `/api/email-config/:id`
- **Method**: PUT
- **URL Params**: id=[integer]
- **Body**: Same as Create
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

### Delete Email Configuration
- **URL**: `/api/email-config/:id`
- **Method**: DELETE
- **URL Params**: id=[integer]
- **Success Response Code**: 200
- **Error Response Code**: 404 if not found

## Error Responses
All endpoints may return these errors:
- **500**: Internal Server Error