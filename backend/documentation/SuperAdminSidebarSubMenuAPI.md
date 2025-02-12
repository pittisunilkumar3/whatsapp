# SuperAdmin Sidebar Sub Menu API Documentation

## Base URL
```
http://localhost:5000/api/superadmin-sidebar-sub-menus
```

## Endpoints

### Create Sub Menu
- **Method**: POST
- **Endpoint**: `/`
- **Description**: Create a new superadmin sidebar sub menu
- **Request Body**:
	```json
	{
		"superadmin_sidebar_menu_id": "number",
		"menu": "string",
		"key": "string",
		"lang_key": "string",
		"url": "string",
		"level": "number",
		"access_permissions": "string",
		"permission_group_id": "number",
		"activate_controller": "string",
		"activate_methods": "string",
		"addon_permission": "string",
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

### Get All Sub Menus
- **Method**: GET
- **Endpoint**: `/`
- **Description**: Retrieve all active superadmin sidebar sub menus
- **Response**:
	```json
	{
		"success": true,
		"data": [
			{
				"id": "number",
				"superadmin_sidebar_menu_id": "number",
				"menu": "string",
				"key": "string",
				"lang_key": "string",
				"url": "string",
				"level": "number",
				"access_permissions": "string",
				"permission_group_id": "number",
				"activate_controller": "string",
				"activate_methods": "string",
				"addon_permission": "string",
				"is_active": "number",
				"created_at": "timestamp"
			}
		]
	}
	```

### Get Sub Menu by ID
- **Method**: GET
- **Endpoint**: `/:id`
- **Description**: Retrieve a specific superadmin sidebar sub menu by ID
- **Parameters**: 
	- `id` (path parameter): Sub Menu ID
- **Response**:
	```json
	{
		"success": true,
		"data": {
			"id": "number",
			"superadmin_sidebar_menu_id": "number",
			"menu": "string",
			"key": "string",
			"lang_key": "string",
			"url": "string",
			"level": "number",
			"access_permissions": "string",
			"permission_group_id": "number",
			"activate_controller": "string",
			"activate_methods": "string",
			"addon_permission": "string",
			"is_active": "number",
			"created_at": "timestamp"
		}
	}
	```

### Get Sub Menus by Menu ID
- **Method**: GET
- **Endpoint**: `/menu/:menuId`
- **Description**: Retrieve all sub menus for a specific menu
- **Parameters**: 
	- `menuId` (path parameter): Parent Menu ID
- **Response**:
	```json
	{
		"success": true,
		"data": [
			{
				"id": "number",
				"superadmin_sidebar_menu_id": "number",
				"menu": "string",
				"key": "string",
				"lang_key": "string",
				"url": "string",
				"level": "number",
				"access_permissions": "string",
				"permission_group_id": "number",
				"activate_controller": "string",
				"activate_methods": "string",
				"addon_permission": "string",
				"is_active": "number",
				"created_at": "timestamp"
			}
		]
	}
	```

### Update Sub Menu
- **Method**: PUT
- **Endpoint**: `/:id`
- **Description**: Update an existing superadmin sidebar sub menu
- **Parameters**: 
	- `id` (path parameter): Sub Menu ID
- **Request Body**:
	```json
	{
		"superadmin_sidebar_menu_id": "number",
		"menu": "string",
		"key": "string",
		"lang_key": "string",
		"url": "string",
		"level": "number",
		"access_permissions": "string",
		"permission_group_id": "number",
		"activate_controller": "string",
		"activate_methods": "string",
		"addon_permission": "string",
		"is_active": "number"
	}
	```
- **Response**:
	```json
	{
		"success": true
	}
	```

### Delete Sub Menu
- **Method**: DELETE
- **Endpoint**: `/:id`
- **Description**: Soft delete a superadmin sidebar sub menu (sets is_active to 0)
- **Parameters**: 
	- `id` (path parameter): Sub Menu ID
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
- `superadmin_sidebar_menu_id`: Parent menu identifier
- `menu`: Sub menu display name
- `key`: Unique menu key identifier
- `lang_key`: Language translation key
- `url`: Menu URL path
- `level`: Menu hierarchy level
- `access_permissions`: Permission string for access control
- `permission_group_id`: Permission group identifier
- `activate_controller`: Controller name for menu activation
- `activate_methods`: Comma-separated list of controller methods
- `addon_permission`: Additional permission requirements
- `is_active`: Active status (0: inactive, 1: active)