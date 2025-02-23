# Company Permission API Documentation

This document outlines the API endpoints for managing company-based permissions, roles, menus, and submenus.

## Base URL
```
/api/company-permissions
```

## Authentication
All endpoints require authentication and expect the company_id to be provided either in the query parameters (GET/DELETE requests) or in the request body (POST/PUT requests).

## Common Response Codes
- `200` - Success
- `201` - Created successfully
- `204` - Deleted successfully
- `400` - Bad request
- `404` - Resource not found
- `500` - Server error

## Endpoints

### Company Roles

#### Create Role
```http
POST /roles
```
**Request Body:**
```json
{
    "company_id": "integer",
    "name": "string",
    "slug": "string",
    "is_active": "integer (0 or 1)",
    "is_system": "integer (0 or 1)",
    "is_superadmin": "integer (0 or 1)"
}
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "name": "Admin",
    "slug": "admin",
    "is_active": 1,
    "is_system": 0,
    "is_superadmin": 0,
    "created_at": "2025-02-23T17:34:25.000Z",
    "updated_at": null
}
```

#### List Roles
```http
GET /roles?company_id=<company_id>
```
**Success Response:**
```json
[
    {
        "id": 1,
        "company_id": 123,
        "name": "Admin",
        "slug": "admin",
        "is_active": 1,
        "is_system": 0,
        "is_superadmin": 0,
        "created_at": "2025-02-23T17:34:25.000Z",
        "updated_at": null
    },
    {
        "id": 2,
        "company_id": 123,
        "name": "Manager",
        "slug": "manager",
        "is_active": 1,
        "is_system": 0,
        "is_superadmin": 0,
        "created_at": "2025-02-23T17:35:00.000Z",
        "updated_at": null
    }
]
```

#### Get Role
```http
GET /roles/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "name": "Admin",
    "slug": "admin",
    "is_active": 1,
    "is_system": 0,
    "is_superadmin": 0,
    "created_at": "2025-02-23T17:34:25.000Z",
    "updated_at": null
}
```

#### Update Role
```http
PUT /roles/:id
```
**Request Body:**
```json
{
    "company_id": "integer",
    "name": "string",
    "slug": "string",
    "is_active": "integer",
    "is_system": "integer",
    "is_superadmin": "integer"
}
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "name": "Admin",
    "slug": "admin",
    "is_active": 1,
    "is_system": 0,
    "is_superadmin": 0,
    "created_at": "2025-02-23T17:34:25.000Z",
    "updated_at": "2025-02-23T17:40:00.000Z"
}
```

#### Delete Role
```http
DELETE /roles/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "message": "Role deleted successfully"
}
```

### Sidebar Menus

#### Create Menu
```http
POST /menus
```
**Request Body:**
```json
{
    "company_id": "integer",
    "permission_group_id": "integer",
    "icon": "string",
    "menu": "string",
    "activate_menu": "string",
    "lang_key": "string",
    "system_level": "integer",
    "level": "integer",
    "sidebar_display": "integer",
    "access_permissions": "text",
    "is_active": "integer"
}
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "permission_group_id": 1,
    "icon": "fa-dashboard",
    "menu": "Dashboard",
    "activate_menu": "dashboard",
    "lang_key": "dashboard",
    "system_level": 0,
    "level": 1,
    "sidebar_display": 1,
    "access_permissions": null,
    "is_active": 1,
    "created_at": "2025-02-23T17:36:00.000Z"
}
```

#### List Menus
```http
GET /menus?company_id=<company_id>
```
**Success Response:**
```json
[
    {
        "id": 1,
        "company_id": 123,
        "permission_group_id": 1,
        "icon": "fa-dashboard",
        "menu": "Dashboard",
        "activate_menu": "dashboard",
        "lang_key": "dashboard",
        "system_level": 0,
        "level": 1,
        "sidebar_display": 1,
        "access_permissions": null,
        "is_active": 1,
        "created_at": "2025-02-23T17:36:00.000Z",
        "submenus": [
            {
                "id": 1,
                "sidebar_menu_id": 1,
                "menu": "Overview",
                "key": "overview",
                "url": "/dashboard/overview",
                "is_active": 1,
                "created_at": "2025-02-23T17:36:30.000Z"
            }
        ]
    }
]
```

#### Get Menu
```http
GET /menus/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "permission_group_id": 1,
    "icon": "fa-dashboard",
    "menu": "Dashboard",
    "activate_menu": "dashboard",
    "lang_key": "dashboard",
    "system_level": 0,
    "level": 1,
    "sidebar_display": 1,
    "access_permissions": null,
    "is_active": 1,
    "created_at": "2025-02-23T17:36:00.000Z"
}
```

#### Update Menu
```http
PUT /menus/:id
```
**Request Body:** Same as Create Menu
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "permission_group_id": 1,
    "icon": "fa-dashboard",
    "menu": "Dashboard",
    "activate_menu": "dashboard",
    "lang_key": "dashboard",
    "system_level": 0,
    "level": 1,
    "sidebar_display": 1,
    "access_permissions": null,
    "is_active": 1,
    "created_at": "2025-02-23T17:36:00.000Z",
    "updated_at": "2025-02-23T17:40:00.000Z"
}
```

#### Delete Menu
```http
DELETE /menus/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "message": "Menu deleted successfully"
}
```

### Sidebar Sub-menus

#### Create Submenu
```http
POST /submenus
```
**Request Body:**
```json
{
    "company_id": "integer",
    "sidebar_menu_id": "integer",
    "menu": "string",
    "key": "string",
    "lang_key": "string",
    "url": "string",
    "level": "integer",
    "access_permissions": "string",
    "permission_group_id": "integer",
    "activate_controller": "string",
    "activate_methods": "string",
    "addon_permission": "string",
    "is_active": "integer"
}
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "sidebar_menu_id": 1,
    "menu": "Overview",
    "key": "overview",
    "lang_key": "dashboard_overview",
    "url": "/dashboard/overview",
    "level": 1,
    "access_permissions": null,
    "permission_group_id": 1,
    "activate_controller": "dashboard",
    "activate_methods": "overview",
    "addon_permission": null,
    "is_active": 1,
    "created_at": "2025-02-23T17:36:30.000Z"
}
```

#### List Submenus
```http
GET /submenus?company_id=<company_id>
```
**Success Response:**
```json
[
    {
        "id": 1,
        "company_id": 123,
        "sidebar_menu_id": 1,
        "menu": "Overview",
        "key": "overview",
        "lang_key": "dashboard_overview",
        "url": "/dashboard/overview",
        "level": 1,
        "access_permissions": null,
        "permission_group_id": 1,
        "activate_controller": "dashboard",
        "activate_methods": "overview",
        "addon_permission": null,
        "is_active": 1,
        "created_at": "2025-02-23T17:36:30.000Z",
        "menu": {
            "id": 1,
            "menu": "Dashboard",
            "icon": "fa-dashboard"
        }
    }
]
```

#### Update Submenu
```http
PUT /submenus/:id
```
**Request Body:** Same as Create Submenu
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "sidebar_menu_id": 1,
    "menu": "Overview",
    "key": "overview",
    "lang_key": "dashboard_overview",
    "url": "/dashboard/overview",
    "level": 1,
    "access_permissions": null,
    "permission_group_id": 1,
    "activate_controller": "dashboard",
    "activate_methods": "overview",
    "addon_permission": null,
    "is_active": 1,
    "created_at": "2025-02-23T17:36:30.000Z",
    "updated_at": "2025-02-23T17:40:00.000Z"
}
```

#### Delete Submenu
```http
DELETE /submenus/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "message": "Submenu deleted successfully"
}
```

### Role Permissions

#### Create Permission
```http
POST /permissions
```
**Request Body:**
```json
{
    "company_id": "integer",
    "company_roles_role_id": "integer",
    "sidebar_menu_id": "integer",
    "sidebar_sub_menu_id": "integer",
    "can_view": "integer",
    "can_add": "integer",
    "can_edit": "integer",
    "can_delete": "integer"
}
```
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "company_roles_role_id": 1,
    "sidebar_menu_id": 1,
    "sidebar_sub_menu_id": 1,
    "can_view": 1,
    "can_add": 1,
    "can_edit": 1,
    "can_delete": 1,
    "created_at": "2025-02-23T17:37:00.000Z"
}
```

#### List Permissions
```http
GET /permissions?company_id=<company_id>
```
**Success Response:**
```json
[
    {
        "id": 1,
        "company_id": 123,
        "company_roles_role_id": 1,
        "sidebar_menu_id": 1,
        "sidebar_sub_menu_id": 1,
        "can_view": 1,
        "can_add": 1,
        "can_edit": 1,
        "can_delete": 1,
        "created_at": "2025-02-23T17:37:00.000Z",
        "role": {
            "id": 1,
            "name": "Admin",
            "slug": "admin"
        },
        "menu": {
            "id": 1,
            "menu": "Dashboard",
            "icon": "fa-dashboard"
        },
        "submenu": {
            "id": 1,
            "menu": "Overview",
            "url": "/dashboard/overview"
        }
    }
]
```

#### Update Permission
```http
PUT /permissions/:id
```
**Request Body:** Same as Create Permission
**Success Response:**
```json
{
    "id": 1,
    "company_id": 123,
    "company_roles_role_id": 1,
    "sidebar_menu_id": 1,
    "sidebar_sub_menu_id": 1,
    "can_view": 1,
    "can_add": 1,
    "can_edit": 1,
    "can_delete": 1,
    "created_at": "2025-02-23T17:37:00.000Z",
    "updated_at": "2025-02-23T17:40:00.000Z"
}
```

#### Delete Permission
```http
DELETE /permissions/:id?company_id=<company_id>
```
**Success Response:**
```json
{
    "message": "Permission deleted successfully"
}
```

### Get Sidebar Menu with Permissions
```http
GET /sidebar-menu-permissions/:roleId?company_id=<company_id>
```
**Description:** Returns a hierarchical structure of menus with their sub-menus and associated permissions for a specific role within a company.

**Parameters:**
- `roleId`: ID of the role to get permissions for
- `company_id`: ID of the company (query parameter)

**Success Response:**
```json
[
    {
        "id": 1,
        "menu": "Dashboard",
        "icon": "fa-dashboard",
        "is_active": true,
        "submenus": [
            {
                "id": 1,
                "menu": "Overview",
                "key": "overview",
                "url": "/dashboard/overview",
                "is_active": true,
                "permissions": {
                    "can_view": true,
                    "can_add": false,
                    "can_edit": true,
                    "can_delete": false
                }
            },
            {
                "id": 2,
                "menu": "Analytics",
                "key": "analytics",
                "url": "/dashboard/analytics",
                "is_active": true,
                "permissions": {
                    "can_view": true,
                    "can_add": true,
                    "can_edit": true,
                    "can_delete": true
                }
            }
        ]
    }
]
```

**Notes:**
- Only active menus and sub-menus are included in the response
- If no permission record exists for a submenu, all permissions default to false
- The response is structured hierarchically with menus containing their respective submenus
- Each submenu includes its specific permissions for the requested role

## Data Models

### Company Role
```typescript
{
    id: number;
    company_id: number;
    name: string;
    slug: string;
    is_active: number;
    is_system: number;
    is_superadmin: number;
    created_at: Date;
    updated_at: Date;
}
```

### Sidebar Menu
```typescript
{
    id: number;
    company_id: number;
    permission_group_id: number;
    icon: string;
    menu: string;
    activate_menu: string;
    lang_key: string;
    system_level: number;
    level: number;
    sidebar_display: number;
    access_permissions: string;
    is_active: number;
    created_at: Date;
}
```

### Sidebar Submenu
```typescript
{
    id: number;
    company_id: number;
    sidebar_menu_id: number;
    menu: string;
    key: string;
    lang_key: string;
    url: string;
    level: number;
    access_permissions: string;
    permission_group_id: number;
    activate_controller: string;
    activate_methods: string;
    addon_permission: string;
    is_active: number;
    created_at: Date;
}
```

### Role Permission
```typescript
{
    id: number;
    company_id: number;
    company_roles_role_id: number;
    sidebar_menu_id: number;
    sidebar_sub_menu_id: number;
    can_view: number;
    can_add: number;
    can_edit: number;
    can_delete: number;
    created_at: Date;
}
```

## Error Handling

All endpoints return error responses in the following format:
```json
{
    "error": "Error message description"
}
```

### Invalid Request Format
```json
{
    "error": "Invalid request parameters"
}
```

### Resource Not Found
```json
{
    "error": "Role not found"
}
```

### Database Error
```json
{
    "error": "Database operation failed"
}
```

### Unauthorized Access
```json
{
    "error": "Unauthorized access to company resource"
}
```

## Notes
1. All timestamps are in ISO 8601 format
2. Boolean values are represented as integers (0 or 1)
3. Company ID validation is enforced on all endpoints
4. Soft delete is not implemented - all deletes are permanent
5. All list endpoints return full objects with related data where appropriate
