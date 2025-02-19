# Company Roles API Documentation

## Table Structure
```sql
CREATE TABLE company_roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
	company_id INT NOT NULL,
	name VARCHAR(100) DEFAULT NULL,
	slug VARCHAR(150) DEFAULT NULL,
	is_active INT DEFAULT 0,
	is_system INT(1) NOT NULL DEFAULT 0,
	is_superadmin INT NOT NULL DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	updated_at DATE DEFAULT NULL,
	FOREIGN KEY (company_id) REFERENCES companies(id)
)
```

## API Endpoints

### Create Company Role
- **URL:** `/api/company-roles`
- **Method:** `POST`
- **Request Body:**
```json
{
	"company_id": 1,
	"name": "Manager",
	"slug": "manager",
	"is_active": 1,
	"is_system": 0,
	"is_superadmin": 0
}
```
- **Success Response:** (201 Created)
```json
{
	"success": true,
	"message": "Company role created successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"name": "Manager",
		"slug": "manager",
		"is_active": 1,
		"is_system": 0,
		"is_superadmin": 0
	}
}
```

### Get All Company Roles
- **URL:** `/api/company-roles`
- **Method:** `GET`
- **Query Parameters:**
  - `company_id`: Filter by company ID (optional)
  - `is_active`: Filter by active status (optional)
  - `is_system`: Filter by system role status (optional)
- **Success Response:** (200 OK)
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"name": "Manager",
			"slug": "manager",
			"is_active": 1,
			"is_system": 0,
			"is_superadmin": 0,
			"created_at": "2024-03-22T10:00:00.000Z",
			"updated_at": "2024-03-22"
		}
	]
}
```

### Get Roles by Company ID
- **URL:** `/api/company-roles`
- **Method:** `GET`
- **Query Parameters:**
  - `company_id` (required): The ID of the company to fetch roles for
  - `is_active` (optional): Filter by active status (0 or 1)
  - `is_system` (optional): Filter by system role status (0 or 1)
- **Success Response:** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "name": "Manager",
      "slug": "manager",
      "is_active": 1,
      "is_system": 0,
      "is_superadmin": 0
    },
    {
      "id": 2,
      "company_id": 1,
      "name": "Employee",
      "slug": "employee",
      "is_active": 1,
      "is_system": 0,
      "is_superadmin": 0
    }
  ]
}
```
- **Error Response:** (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Failed to fetch company roles",
  "error": "Error details"
}
```

#### Example Request
```bash
# Fetch all roles for company with ID 1
GET /api/company-roles?company_id=1

# Fetch active roles for company with ID 1
GET /api/company-roles?company_id=1&is_active=1
```

### Get Company Role by ID
- **URL:** `/api/company-roles/:id`
- **Method:** `GET`
- **Success Response:** (200 OK)
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"name": "Manager",
		"slug": "manager",
		"is_active": 1,
		"is_system": 0,
		"is_superadmin": 0,
		"created_at": "2024-03-22T10:00:00.000Z",
		"updated_at": "2024-03-22"
	}
}
```

### Update Company Role
- **URL:** `/api/company-roles/:id`
- **Method:** `PUT`
- **Request Body:**
```json
{
	"company_id": 1,
	"name": "Senior Manager",
	"slug": "senior-manager",
	"is_active": 1,
	"is_system": 0,
	"is_superadmin": 0
}
```
- **Success Response:** (200 OK)
```json
{
	"success": true,
	"message": "Company role updated successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"name": "Senior Manager",
		"slug": "senior-manager",
		"is_active": 1,
		"is_system": 0,
		"is_superadmin": 0,
		"created_at": "2024-03-22T10:00:00.000Z",
		"updated_at": "2024-03-22"
	}
}
```

### Delete Company Role
- **URL:** `/api/company-roles/:id`
- **Method:** `DELETE`
- **Success Response:** (200 OK)
```json
{
	"success": true,
	"message": "Company role deleted successfully"
}
```

### Toggle Company Role Active Status
- **URL:** `/api/company-roles/:id/toggle-active`
- **Method:** `PATCH`
- **Request Body:**
```json
{
	"is_active": 1
}
```
- **Success Response:** (200 OK)
```json
{
	"success": true,
	"message": "Company role activated successfully"
}
```

## Error Responses
All endpoints return error responses in the following format:
```json
{
	"success": false,
	"message": "Error message description",
	"error": "Detailed error message (only in development)"
}
```

Common HTTP status codes:
- 201: Created successfully
- 200: Request successful
- 404: Resource not found
- 500: Internal server error