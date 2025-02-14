# Superadmin Role Permissions API Documentation

## Table Structure
```sql
CREATE TABLE superadmin_roles_permissions (
	id INT PRIMARY KEY AUTO_INCREMENT,
	role_id INT DEFAULT NULL,
	superadmin_sidebar_menu_id INT NOT NULL,
	superadmin_sidebar_sub_menu_id INT NOT NULL,
	can_view INT DEFAULT NULL,
	can_add INT DEFAULT NULL,
	can_edit INT DEFAULT NULL,
	can_delete INT DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (role_id) REFERENCES roles(id),
	FOREIGN KEY (superadmin_sidebar_menu_id) REFERENCES superadmin_sidebar_menus(id),
	FOREIGN KEY (superadmin_sidebar_sub_menu_id) REFERENCES superadmin_sidebar_sub_menus(id)
)
```

## API Endpoints

### Create Superadmin Role Permission
- **URL:** `/api/superadmin-role-permissions`
- **Method:** `POST`
- **Request Body:**
```json
{
	"role_id": 1,
	"superadmin_sidebar_menu_id": 1,
	"superadmin_sidebar_sub_menu_id": 1,
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
	"message": "Superadmin role permission created successfully",
	"data": {
		"id": 1,
		"role_id": 1,
		"superadmin_sidebar_menu_id": 1,
		"superadmin_sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1
	}
}
```

### Get All Superadmin Role Permissions
- **URL:** `/api/superadmin-role-permissions`
- **Method:** `GET`
- **Query Parameters:**
  - `role_id`: Filter by role ID (optional)
  - `superadmin_sidebar_menu_id`: Filter by menu ID (optional)
  - `superadmin_sidebar_sub_menu_id`: Filter by submenu ID (optional)
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"superadmin_sidebar_menu_id": 1,
			"superadmin_sidebar_sub_menu_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"created_at": "2024-03-22T10:00:00.000Z"
		}
	]
}
```

### Get Superadmin Role Permission by ID
- **URL:** `/api/superadmin-role-permissions/:id`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"role_id": 1,
		"superadmin_sidebar_menu_id": 1,
		"superadmin_sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1,
		"created_at": "2024-03-22T10:00:00.000Z"
	}
}
```

### Get Permissions by Role
- **URL:** `/api/superadmin-role-permissions/role/:roleId`
- **Method:** `GET`
- **Success Response:**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"superadmin_sidebar_menu_id": 1,
			"superadmin_sidebar_sub_menu_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"created_at": "2024-03-22T10:00:00.000Z"
		}
	]
}
```

### Update Superadmin Role Permission
- **URL:** `/api/superadmin-role-permissions/:id`
- **Method:** `PUT`
- **Request Body:**
```json
{
	"role_id": 1,
	"superadmin_sidebar_menu_id": 1,
	"superadmin_sidebar_sub_menu_id": 1,
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
	"message": "Superadmin role permission updated successfully",
	"data": {
		"id": 1,
		"role_id": 1,
		"superadmin_sidebar_menu_id": 1,
		"superadmin_sidebar_sub_menu_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 1
	}
}
```

### Delete Superadmin Role Permission
- **URL:** `/api/superadmin-role-permissions/:id`
- **Method:** `DELETE`
- **Success Response:**
```json
{
	"success": true,
	"message": "Superadmin role permission deleted successfully"
}
```

### Delete All Permissions for a Role
- **URL:** `/api/superadmin-role-permissions/role/:roleId`
- **Method:** `DELETE`
- **Success Response:**
```json
{
	"success": true,
	"message": "Superadmin role permissions deleted successfully"
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