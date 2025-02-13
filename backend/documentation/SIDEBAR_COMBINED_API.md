# Sidebar Combined API Documentation

This API provides endpoints to fetch sidebar menus along with their associated sub-menus.

## Base URL
`http://localhost:3000/api/sidebar-combined`

## Endpoints

### Get Company Sidebar Menus with Sub-menus

Retrieves all sidebar menus and their sub-menus for a specific company.

- **URL**: `/api/sidebar-combined/company/:companyId/menus-with-submenus`
- **Method**: `GET`
- **URL Parameters**: 
	- `companyId`: ID of the company
- **Success Response**:
	- **Code**: 200
	- **Content Example**:
		```json
		{
			"data": [
				{
					"id": 1,
					"company_id": 1,
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
					"sub_menus": [
						{
							"id": 1,
							"company_id": 1,
							"sidebar_menu_id": 1,
							"menu": "Overview",
							"key": "overview",
							"url": "/dashboard/overview",
							"level": 1,
							"access_permissions": "view_overview",
							"is_active": 1
						}
					]
				}
			]
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: `{ "error": "Error message" }`

### Get All Sidebar Menus with Sub-menus

Retrieves all sidebar menus along with their associated sub-menus.

- **URL**: `/api/sidebar-combined/menus-with-submenus`
- **Method**: `GET`
- **Success Response**:
	- **Code**: 200
	- **Content Example**:
		```json
		{
			"data": [
				{
					"id": 1,
					"company_id": 1,
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
					"sub_menus": [
						{
							"id": 1,
							"company_id": 1,
							"sidebar_menu_id": 1,
							"menu": "Overview",
							"key": "overview",
							"url": "/dashboard/overview",
							"level": 1,
							"access_permissions": "view_overview",
							"is_active": 1
						}
					]
				}
			]
		}
		```
- **Error Response**:
	- **Code**: 500
	- **Content**: `{ "error": "Error message" }`

### Get Single Sidebar Menu with Sub-menus

Retrieves a specific sidebar menu along with its associated sub-menus.

- **URL**: `/api/sidebar-combined/menu-with-submenus/:id`
- **Method**: `GET`
- **URL Parameters**: 
	- `id`: ID of the sidebar menu
- **Success Response**:
	- **Code**: 200
	- **Content Example**:
		```json
		{
			"data": {
				"id": 1,
				"company_id": 1,
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
				"sub_menus": [
					{
						"id": 1,
						"company_id": 1,
						"sidebar_menu_id": 1,
						"menu": "Overview",
						"key": "overview",
						"url": "/dashboard/overview",
						"level": 1,
						"access_permissions": "view_overview",
						"is_active": 1
					}
				]
			}
		}
		```
- **Error Responses**:
	- **Code**: 404
		- **Content**: `{ "message": "Sidebar menu not found" }`
	- **Code**: 500
		- **Content**: `{ "error": "Error message" }`

### Create Sidebar Menu with Sub-menus

Creates a new sidebar menu along with its associated sub-menus.

- **URL**: `/api/sidebar-combined/create-menu-with-submenus`
- **Method**: `POST`
- **Request Body**:
    ```json
{
	"menu": {
		"company_id": "number",
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
        },
"subMenus": [
	{
		"company_id": "number",
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
        ]
    }
    ```
- **Success Response**:
    - **Code**: 201
    - **Content Example**:
        ```json
        {
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
                "sub_menus": [
                    {
                        "id": 1,
                        "sidebar_menu_id": 1,
                        "menu": "Overview",
                        "key": "overview",
                        "url": "/dashboard/overview",
                        "level": 1,
                        "access_permissions": "view_overview",
                        "is_active": 1
                    }
                ]
            }
        }
        ```
- **Error Response**:
	- **Code**: 500
	- **Content**: `{ "error": "Error message" }`

### Delete Sidebar Menu with Sub-menus

Deletes a sidebar menu along with all its associated sub-menus.

- **URL**: `/api/sidebar-combined/delete-menu-with-submenus/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
	- `id`: ID of the sidebar menu to delete
- **Success Response**:
	- **Code**: 200
	- **Content**: 
		```json
		{
			"message": "Menu and associated sub-menus deleted successfully"
		}
		```
- **Error Responses**:
	- **Code**: 404
		- **Content**: `{ "message": "Sidebar menu not found" }`
	- **Code**: 500
		- **Content**: `{ "error": "Error message" }`