# Company Employee Roles API Documentation

## Table Structure
```sql
CREATE TABLE company_employee_roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
	company_id INT NOT NULL,
	role_id INT DEFAULT NULL,
	company_employee_id INT DEFAULT NULL,
	is_active INT DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	updated_at DATE DEFAULT NULL,
	FOREIGN KEY (company_id) REFERENCES companies(id),
	FOREIGN KEY (role_id) REFERENCES company_roles(id),
	FOREIGN KEY (company_employee_id) REFERENCES company_employee(id)
)
```

## API Endpoints

### Create Company Employee Role
- **URL:** `/api/company-employee-roles`
- **Method:** `POST`
- **Request Body:**
```json
{
	"company_id": 1,
	"role_id": 1,
	"company_employee_id": 1,
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"success": true,
	"message": "Company employee role created successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"role_id": 1,
		"company_employee_id": 1,
		"is_active": 1
	}
}
```

### Get All Company Employee Roles
- **URL:** `/api/company-employee-roles`
- **Method:** `GET`
- **Query Parameters:**
  - `company_id`: Filter by company ID (optional)
  - `role_id`: Filter by role ID (optional)
  - `company_employee_id`: Filter by employee ID (optional)
  - `is_active`: Filter by active status (optional)
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"role_id": 1,
			"company_employee_id": 1,
			"is_active": 1,
			"created_at": "2024-03-22T10:00:00.000Z",
			"updated_at": "2024-03-22"
		}
	]
}
```

### Get Company Employee Role by ID
- **URL:** `/api/company-employee-roles/:id`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"role_id": 1,
		"company_employee_id": 1,
		"is_active": 1,
		"created_at": "2024-03-22T10:00:00.000Z",
		"updated_at": "2024-03-22"
	}
}
```

### Get Roles by Employee ID
- **URL:** `/api/company-employee-roles/employee/:employeeId`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"role_id": 1,
			"company_employee_id": 1,
			"is_active": 1,
			"created_at": "2024-03-22T10:00:00.000Z",
			"updated_at": "2024-03-22"
		}
	]
}
```

### Update Company Employee Role
- **URL:** `/api/company-employee-roles/:id`
- **Method:** `PUT`
- **Request Body:**
```json
{
	"company_id": 1,
	"role_id": 2,
	"company_employee_id": 1,
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"success": true,
	"message": "Company employee role updated successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"role_id": 2,
		"company_employee_id": 1,
		"is_active": 1
	}
}
```

### Delete Company Employee Role
- **URL:** `/api/company-employee-roles/:id`
- **Method:** `DELETE`
- **Success Response:**
```json
{
	"success": true,
	"message": "Company employee role deleted successfully"
}
```

### Toggle Company Employee Role Active Status
- **URL:** `/api/company-employee-roles/:id/toggle-active`
- **Method:** `PATCH`
- **Request Body:**
```json
{
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"success": true,
	"message": "Company employee role activated successfully"
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