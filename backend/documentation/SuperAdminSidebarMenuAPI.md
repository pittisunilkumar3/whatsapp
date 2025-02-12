# SuperAdmin Sidebar Menu API Documentation

## Base URL
```
http://localhost:5000/api/superadmin-sidebar-menus
```

## Endpoints

### Create Sidebar Menu
- **Method**: POST
- **Endpoint**: `/`
- **Description**: Create a new superadmin sidebar menu
- **Request Body**:
	```json
	{
		"permission_group_id": "number",
		"icon": "string",
		"menu": "string",
		"activate_menu": "string",
		"lang_key": "string",
		"system_level": "number",
		"level": "number",
		"sidebar_display": "number",
		"access_permissions": "string",
		"is_active": "number"
	}
	```
- **Response**: 
	```json
	{
		"success": true,
		"id": "number"
	}
	```

### Get All Sidebar Menus
- **Method**: GET
- **Endpoint**: `/`
- **Description**: Retrieve all active superadmin sidebar menus
- **Response**:
	```json
	{
		"success": true,
		"data": [
			{
				"id": "number",
				"permission_group_id": "number",
				"icon": "string",
				"menu": "string",
				"activate_menu": "string",
				"lang_key": "string",
				"system_level": "number",
				"level": "number",
				"sidebar_display": "number",
				"access_permissions": "string",
				"is_active": "number",
				"created_at": "timestamp"
			}
		]
	}
	```

### Get Sidebar Menu by ID
- **Method**: GET
- **Endpoint**: `/:id`
- **Description**: Retrieve a specific superadmin sidebar menu by ID
- **Parameters**: 
	- `id` (path parameter): Menu ID
- **Response**:
	```json
	{
		"success": true,
		"data": {
			"id": "number",
			"permission_group_id": "number",
			"icon": "string",
			"menu": "string",
			"activate_menu": "string",
			"lang_key": "string",
			"system_level": "number",
			"level": "number",
			"sidebar_display": "number",
			"access_permissions": "string",
			"is_active": "number",
			"created_at": "timestamp"
		}
	}
	```

### Update Sidebar Menu
- **Method**: PUT
- **Endpoint**: `/:id`
- **Description**: Update an existing superadmin sidebar menu
- **Parameters**: 
	- `id` (path parameter): Menu ID
- **Request Body**:
	```json
	{
		"permission_group_id": "number",
		"icon": "string",
		"menu": "string",
		"activate_menu": "string",
		"lang_key": "string",
		"system_level": "number",
		"level": "number",
		"sidebar_display": "number",
		"access_permissions": "string",
		"is_active": "number"
	}
	```
- **Response**:
	```json
	{
		"success": true
	}
	```

### Delete Sidebar Menu
- **Method**: DELETE
- **Endpoint**: `/:id`
- **Description**: Soft delete a superadmin sidebar menu (sets is_active to 0)
- **Parameters**: 
	- `id` (path parameter): Menu ID
- **Response**:
	```json
	{
		"success": true
	}
	```

## Error Responses
All endpoints may return the following error response:
```json
{
	"success": false,
	"error": "Error message description"
}
```

## Field Descriptions
- `permission_group_id`: Permission group identifier
- `icon`: Menu icon identifier/class
- `menu`: Menu display name
- `activate_menu`: Menu activation identifier
- `lang_key`: Language translation key
- `system_level`: System level access (0-999)
- `level`: Menu hierarchy level
- `sidebar_display`: Display flag (0: hidden, 1: visible)
- `access_permissions`: JSON string of access permissions
- `is_active`: Active status (0: inactive, 1: active)