# SuperAdmin Sidebar Combined API Documentation

## 1. Get All Combined Sidebar Menus
Retrieves all superadmin sidebar menus along with their associated submenus.

### Endpoint
```
GET /api/superadmin-sidebar/superadmin-sidebar-combined
```

### Response Format
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"permission_group_id": 1,
			"icon": "dashboard",
			"menu": "Dashboard",
			"activate_menu": "dashboard",
			"lang_key": "dashboard",
			"system_level": 0,
			"level": 1,
			"sidebar_display": 1,
			"access_permissions": "view_dashboard",
			"is_active": 1,
			"created_at": "2024-03-20T10:00:00.000Z",
			"submenus": [
				{
					"id": 1,
					"menu": "Overview",
					"key": "overview",
					"lang_key": "overview",
					"url": "/dashboard/overview",
					"level": 1,
					"access_permissions": "view_overview",
					"permission_group_id": 1,
					"activate_controller": "dashboard",
					"activate_methods": "overview",
					"addon_permission": null,
					"is_active": 1
				}
			]
		}
	]
}
```

## 2. Get Single Sidebar Menu
Retrieves a specific superadmin sidebar menu with its submenus.

### Endpoint
```
GET /api/superadmin-sidebar/superadmin-sidebar-combined/:id
```

### Parameters
- `id`: ID of the sidebar menu to retrieve

### Response Format
```json
{
	"success": true,
	"data": {
		"id": 1,
		"permission_group_id": 1,
		"icon": "dashboard",
		"menu": "Dashboard",
		"activate_menu": "dashboard",
		"lang_key": "dashboard",
		"system_level": 0,
		"level": 1,
		"sidebar_display": 1,
		"access_permissions": "view_dashboard",
		"is_active": 1,
		"created_at": "2024-03-20T10:00:00.000Z",
		"submenus": [
			{
				"id": 1,
				"menu": "Overview",
				"key": "overview",
				"lang_key": "overview",
				"url": "/dashboard/overview",
				"level": 1,
				"access_permissions": "view_overview",
				"permission_group_id": 1,
				"activate_controller": "dashboard",
				"activate_methods": "overview",
				"addon_permission": null,
				"is_active": 1
			}
		]
	}
}
```

### Error Response (404)
```json
{
	"success": false,
	"message": "Menu not found"
}
```

## 3. Create Sidebar Menu with Submenus
Creates a new superadmin sidebar menu with its associated submenus.

### Endpoint
```
POST /api/superadmin-sidebar/superadmin-sidebar-combined
```

### Request Body
```json
{
	"menu": {
		"permission_group_id": 1,
		"icon": "dashboard",
		"menu": "Dashboard",
		"activate_menu": "dashboard",
		"lang_key": "dashboard",
		"system_level": 0,
		"level": 1,
		"sidebar_display": 1,
		"access_permissions": "view_dashboard",
		"is_active": 1
	},
	"submenus": [
		{
			"menu": "Overview",
			"key": "overview",
			"lang_key": "overview",
			"url": "/dashboard/overview",
			"level": 1,
			"access_permissions": "view_overview",
			"permission_group_id": 1,
			"activate_controller": "dashboard",
			"activate_methods": "overview",
			"is_active": 1
		}
	]
}
```

### Success Response
```json
{
	"success": true,
	"message": "Menu and submenus created successfully",
	"menuId": 1
}
```

### Error Response
```json
{
	"success": false,
	"message": "Error creating sidebar menu",
	"error": "Error details"
}
```

### Notes
- All endpoints return data in a consistent format with `success` boolean flag
- The create endpoint uses transactions to ensure data consistency
- Submenus are optional when creating a new menu
- Menus with no submenus will have an empty submenus array
- All submenus are properly nested under their parent menu
- The endpoint combines data from both `superadmin_sidebar_menus` and `superadmin_sidebar_sub_menus` tables