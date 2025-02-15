# Test Superadmin API Documentation

Base URL: `/api/testsuperadmin`

## Roles

### Create Role
- **POST** `/roles`
- **Body:**
	```json
	{
		"name": "Admin",
		"slug": "admin",
		"is_active": true
	}
	```
- **Response:** Returns the created role object with ID

### Get All Roles
- **GET** `/roles`
- **Response:** Returns an array of role objects

### Get Role by ID
- **GET** `/roles/:id`
- **Response:** Returns a single role object
- **Error:** 404 if role not found

### Update Role
- **PUT** `/roles/:id`
- **Body:**
	```json
	{
		"name": "Updated Admin",
		"slug": "updated-admin",
		"is_active": true
	}
	```
- **Response:** Returns the updated role object
- **Error:** 404 if role not found

### Delete Role
- **DELETE** `/roles/:id`
- **Response:** 204 No Content
- **Error:** 404 if role not found

## Sidebar Menu Structure

### Get Sidebar Menu with Permissions
- **GET** `/sidebar-menu-permissions/:roleId`
- **Description:** Returns a hierarchical structure of menus with their sub-menus and associated permissions for a specific role
- **Parameters:**
	- `roleId`: ID of the role to get permissions for
- **Response Format:**
	```json
	[
		{
			"id": 1,
			"menuName": "Dashboard",
			"icon": "dashboard-icon",
			"isActive": true,
			"submenus": [
				{
					"id": 1,
					"menuName": "User Management",
					"url": "/users",
					"isActive": true,
					"permissions": {
						"canView": true,
						"canAdd": false,
						"canEdit": true,
						"canDelete": false
					}
				}
			]
		}
	]
	```
- **Notes:**
	- Only active menus and sub-menus are included
	- Permissions default to false if no permission record exists
	- Sub-menus array will be empty if no sub-menus exist

### Create Menu
- **POST** `/menus`
- **Body:**
	```json
	{
		"menu_name": "Dashboard",
		"icon": "dashboard-icon",
		"is_active": true
	}
	```
- **Response:** Returns the created menu object with ID

### Get All Menus
- **GET** `/menus`
- **Response:** Returns menus with their associated sub-menus

### Get Menu by ID
- **GET** `/menus/:id`
- **Response:** Returns a single menu object with its associated sub-menus
- **Error:** 404 if menu not found

### Update Menu
- **PUT** `/menus/:id`
- **Body:**
	```json
	{
		"menu_name": "Updated Dashboard",
		"icon": "new-icon",
		"is_active": true
	}
	```
- **Response:** Returns the updated menu object
- **Error:** 404 if menu not found

### Delete Menu
- **DELETE** `/menus/:id`
- **Response:** 204 No Content
- **Error:** 404 if menu not found

## Sidebar Sub-menus

### Create Sub-menu
- **POST** `/submenus`
- **Body:**
	```json
	{
		"menu_id": 1,
		"menu_name": "User Management",
		"url": "/users",
		"is_active": true
	}
	```
- **Response:** Returns the created sub-menu object with ID

### Get All Sub-menus
- **GET** `/submenus`
- **Response:** Returns sub-menus with their associated menu information

### Update Sub-menu
- **PUT** `/submenus/:id`
- **Body:**
	```json
	{
		"menu_id": 1,
		"menu_name": "Updated User Management",
		"url": "/users-management",
		"is_active": true
	}
	```
- **Response:** Returns the updated sub-menu object
- **Error:** 404 if sub-menu not found

### Delete Sub-menu
- **DELETE** `/submenus/:id`
- **Response:** 204 No Content
- **Error:** 404 if sub-menu not found

## Role Permissions

### Create Permission
- **POST** `/permissions`
- **Body:**
	```json
	{
		"role_id": 1,
		"menu_id": 1,
		"submenu_id": 1,
		"can_view": true,
		"can_add": true,
		"can_edit": true,
		"can_delete": false
	}
	```
- **Response:** Returns the created permission object with ID

### Get All Permissions
- **GET** `/permissions`
- **Response:** Returns permissions with associated role, menu, and sub-menu information

### Update Permission
- **PUT** `/permissions/:id`
- **Body:**
	```json
	{
		"can_view": true,
		"can_add": false,
		"can_edit": true,
		"can_delete": true
	}
	```
- **Response:** Returns the updated permission object
- **Error:** 404 if permission not found

### Delete Permission
- **DELETE** `/permissions/:id`
- **Response:** 204 No Content
- **Error:** 404 if permission not found

## Error Responses

All endpoints may return the following error responses:
- **400 Bad Request:** Invalid input data
- **404 Not Found:** Requested resource not found
- **500 Internal Server Error:** Server-side error

Error response format:
```json
{
	"error": "Error message description"
}
```