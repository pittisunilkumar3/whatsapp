const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const CompanyRoleModel = require('../models/CompanyRoleModel');
const SidebarMenuModel = require('../models/SidebarMenuModel');
const SidebarSubMenuModel = require('../models/SidebarSubMenuModel');
const CompanyRolePermissionModel = require('../models/CompanyRolePermissionModel');

// Debug middleware
router.use((req, res, next) => {
    console.log('=== Company Permission Route Debug ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    console.log('===============================');
    next();
});

// Company Roles CRUD
router.post('/roles', async (req, res) => {
    try {
        const role = await CompanyRoleModel.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/roles', async (req, res) => {
    try {
        const roles = await CompanyRoleModel.findAll({
            where: {
                company_id: req.query.company_id
            }
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/roles/:id', async (req, res) => {
    try {
        const role = await CompanyRoleModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            }
        });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/roles/:id', async (req, res) => {
    try {
        const role = await CompanyRoleModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.body.company_id
            }
        });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        await role.update(req.body);
        res.json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/roles/:id', async (req, res) => {
    try {
        const role = await CompanyRoleModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            }
        });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        await role.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sidebar Menus CRUD
router.post('/menus', async (req, res) => {
    try {
        const menu = await SidebarMenuModel.create(req.body);
        res.status(201).json(menu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/menus', async (req, res) => {
    try {
        const menus = await SidebarMenuModel.findAll({
            where: {
                company_id: req.query.company_id,
                is_active: 1
            },
            include: [{
                model: SidebarSubMenuModel,
                as: 'submenus',
                where: { is_active: 1 },
                required: false
            }]
        });
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/menus/:id', async (req, res) => {
    try {
        const menu = await SidebarMenuModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            },
            include: [{
                model: SidebarSubMenuModel,
                as: 'submenus',
                where: { is_active: 1 },
                required: false
            }]
        });
        if (!menu) return res.status(404).json({ error: 'Menu not found' });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/menus/:id', async (req, res) => {
    try {
        const menu = await SidebarMenuModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.body.company_id
            }
        });
        if (!menu) return res.status(404).json({ error: 'Menu not found' });
        await menu.update(req.body);
        res.json(menu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/menus/:id', async (req, res) => {
    try {
        const menu = await SidebarMenuModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            }
        });
        if (!menu) return res.status(404).json({ error: 'Menu not found' });
        await menu.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sidebar Sub-menus CRUD
router.post('/submenus', async (req, res) => {
    try {
        const submenu = await SidebarSubMenuModel.create(req.body);
        res.status(201).json(submenu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/submenus', async (req, res) => {
    try {
        const submenus = await SidebarSubMenuModel.findAll({
            where: {
                company_id: req.query.company_id
            },
            include: [{
                model: SidebarMenuModel,
                as: 'menu'
            }]
        });
        res.json(submenus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/submenus/:id', async (req, res) => {
    try {
        const submenu = await SidebarSubMenuModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.body.company_id
            }
        });
        if (!submenu) return res.status(404).json({ error: 'Submenu not found' });
        await submenu.update(req.body);
        res.json(submenu);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/submenus/:id', async (req, res) => {
    try {
        const submenu = await SidebarSubMenuModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            }
        });
        if (!submenu) return res.status(404).json({ error: 'Submenu not found' });
        await submenu.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Role Permissions CRUD
router.post('/permissions', async (req, res) => {
    try {
        const permission = await CompanyRolePermissionModel.create(req.body);
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/permissions', async (req, res) => {
    try {
        const permissions = await CompanyRolePermissionModel.findAll({
            where: {
                company_id: req.query.company_id
            },
            include: [
                {
                    model: CompanyRoleModel,
                    as: 'role'
                },
                {
                    model: SidebarMenuModel,
                    as: 'menu'
                },
                {
                    model: SidebarSubMenuModel,
                    as: 'submenu'
                }
            ]
        });
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/permissions/:id', async (req, res) => {
    try {
        const permission = await CompanyRolePermissionModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.body.company_id
            }
        });
        if (!permission) return res.status(404).json({ error: 'Permission not found' });
        await permission.update(req.body);
        res.json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/permissions/:id', async (req, res) => {
    try {
        const permission = await CompanyRolePermissionModel.findOne({
            where: {
                id: req.params.id,
                company_id: req.query.company_id
            }
        });
        if (!permission) return res.status(404).json({ error: 'Permission not found' });
        await permission.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seed test data (only for development)
router.post('/seed-test-data', async (req, res) => {
    try {
        const { company_id, role_id } = req.body;
        
        if (!company_id || !role_id) {
            return res.status(400).json({ 
                error: "Both company_id and role_id are required"
            });
        }

        const seedMenuData = require('../seeders/menuData');
        const result = await seedMenuData(company_id, role_id);

        res.json({ 
            message: 'Test data seeded successfully',
            data: result
        });
    } catch (error) {
        console.error('Error seeding test data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Sidebar Menu with Permissions
router.get('/sidebar-menu-permissions/:roleId', async (req, res) => {
    try {
        const { company_id } = req.query;

        // Debug logging
        console.log('Request params:', {
            roleId: req.params.roleId,
            company_id: company_id
        });

        // Validate required parameters
        if (!company_id) {
            return res.status(400).json({ 
                error: "Missing required query parameter: company_id",
                example: "/sidebar-menu-permissions/4?company_id=1"
            });
        }

        // First verify if the role exists and belongs to the company
        const role = await CompanyRoleModel.findOne({
            where: {
                id: req.params.roleId,
                company_id: company_id
            }
        });

        console.log('Found role:', role);

        if (!role) {
            return res.status(404).json({ error: 'Role not found or does not belong to this company' });
        }

        // Get all active menus with their submenus
        const menus = await SidebarMenuModel.findAll({
            where: {
                is_active: 1
            },
            include: [{
                model: SidebarSubMenuModel,
                as: 'submenus',
                where: { is_active: 1 },
                required: false,
                attributes: ['id', 'menu', 'key', 'url', 'is_active']
            }],
            attributes: ['id', 'menu', 'icon', 'is_active']
        });

        console.log('Raw menus query result:', JSON.stringify(menus, null, 2));

        // Get all permissions for this role
        const permissions = await CompanyRolePermissionModel.findAll({
            where: {
                company_id: company_id,
                company_roles_role_id: req.params.roleId
            }
        });

        console.log('Raw permissions query result:', JSON.stringify(permissions, null, 2));

        // Create a map of permissions for quick lookup
        const permissionMap = {};
        permissions.forEach(permission => {
            const key = `${permission.sidebar_menu_id}-${permission.sidebar_sub_menu_id}`;
            permissionMap[key] = {
                can_view: Boolean(permission.can_view),
                can_add: Boolean(permission.can_add),
                can_edit: Boolean(permission.can_edit),
                can_delete: Boolean(permission.can_delete)
            };
        });

        // Transform the menu structure and add permissions
        const menuStructure = menus.map(menu => {
            const menuData = menu.get({ plain: true });
            
            // Transform submenus and add their permissions
            if (menuData.submenus) {
                menuData.submenus = menuData.submenus.map(submenu => {
                    const permKey = `${menu.id}-${submenu.id}`;
                    const permissions = permissionMap[permKey] || {
                        can_view: false,
                        can_add: false,
                        can_edit: false,
                        can_delete: false
                    };

                    return {
                        id: submenu.id,
                        menu: submenu.menu,
                        key: submenu.key,
                        url: submenu.url,
                        is_active: Boolean(submenu.is_active),
                        permissions
                    };
                });
            }

            return {
                id: menuData.id,
                menu: menuData.menu,
                icon: menuData.icon,
                is_active: Boolean(menuData.is_active),
                submenus: menuData.submenus || []
            };
        });

        console.log('Final menu structure:', JSON.stringify(menuStructure, null, 2));

        res.json(menuStructure);
    } catch (error) {
        console.error('Error in sidebar-menu-permissions route:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
