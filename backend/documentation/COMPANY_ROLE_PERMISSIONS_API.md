# Company Role Permissions API Documentation

## Table Structure
```sql
CREATE TABLE company_roles_permissions (
	id INT PRIMARY KEY AUTO_INCREMENT,
	company_id INT NOT NULL,
	company_roles_role_id INT DEFAULT NULL,
	sidebar_menu_id INT NOT NULL,
	sidebar_sub_menu_id INT NOT NULL,
	can_view INT DEFAULT NULL,
	can_add INT DEFAULT NULL,
	can_edit INT DEFAULT NULL,
	can_delete INT DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (company_id) REFERENCES companies(id),
	FOREIGN KEY (company_roles_role_id) REFERENCES company_roles(id),
	FOREIGN KEY (sidebar_menu_id) REFERENCES sidebar_menus(id),
	FOREIGN KEY (sidebar_sub_menu_id) REFERENCES sidebar_sub_menus(id)
)
```

## API Endpoints

### Create Company Role Permission
- **URL:** `/api/company-role-permissions`
- **Method:** `POST`
- **Request Body:**
```json
{
	"company_id": 1,
	"company_roles_role_id": 1,
	"sidebar_menu_id": 1,
	"sidebar_sub_menu_id": 1,
	"can_view": 1,
	"can_add": 1,
	"can_edit": 1,
	"can_delete": 1
}
```
- **Success Response:**
```json
{
	"success": true,
	"message": "Company role permission created successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"company_roles_role_id": 1,
		"sidebar_menu_id": 1,
		"sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1
	}
}
```

### Get All Company Role Permissions
- **URL:** `/api/company-role-permissions`
- **Method:** `GET`
- **Query Parameters:**
  - `company_id`: Filter by company ID (optional)
  - `company_roles_role_id`: Filter by role ID (optional)
  - `sidebar_menu_id`: Filter by menu ID (optional)
  - `sidebar_sub_menu_id`: Filter by submenu ID (optional)
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"company_roles_role_id": 1,
			"sidebar_menu_id": 1,
			"sidebar_sub_menu_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"created_at": "2024-03-22T10:00:00.000Z"
		}
	]
}
```

### Get Company Role Permission by ID
- **URL:** `/api/company-role-permissions/:id`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"company_id": 1,
		"company_roles_role_id": 1,
		"sidebar_menu_id": 1,
		"sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1,
		"created_at": "2024-03-22T10:00:00.000Z"
	}
}
```

### Get Permissions by Company Role
- **URL:** `/api/company-role-permissions/company/:companyId/role/:roleId`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"company_id": 1,
			"company_roles_role_id": 1,
			"sidebar_menu_id": 1,
			"sidebar_sub_menu_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"created_at": "2024-03-22T10:00:00.000Z"
		}
	]
}
```

### Update Company Role Permission
- **URL:** `/api/company-role-permissions/:id`
- **Method:** `PUT`
- **Request Body:**
```json
{
	"company_id": 1,
	"company_roles_role_id": 1,
	"sidebar_menu_id": 1,
	"sidebar_sub_menu_id": 1,
	"can_view": 1,
	"can_add": 1,
	"can_edit": 1,
	"can_delete": 1
}
```
- **Success Response:**
```json
{
	"success": true,
	"message": "Company role permission updated successfully",
	"data": {
		"id": 1,
		"company_id": 1,
		"company_roles_role_id": 1,
		"sidebar_menu_id": 1,
		"sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1
	}
}
```

### Delete Company Role Permission
- **URL:** `/api/company-role-permissions/:id`
- **Method:** `DELETE`
- **Success Response:**
```json
{
	"success": true,
	"message": "Company role permission deleted successfully"
}
```

### Delete All Permissions for a Company Role
- **URL:** `/api/company-role-permissions/company/:companyId/role/:roleId`
- **Method:** `DELETE`
- **Success Response:**
```json
{
	"success": true,
	"message": "Company role permissions deleted successfully"
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