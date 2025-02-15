const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
	TestSuperadminRole,
	TestSuperadminSidebarMenu,
	TestSuperadminSidebarSubMenu,
	TestSuperadminRolePermission
} = require('../models');

// Debug middleware
router.use((req, res, next) => {
	console.log('=== TestSuperadmin Route Debug ===');
	console.log('URL:', req.url);
	console.log('Method:', req.method);
	console.log('Path:', req.path);
	console.log('Params:', req.params);
	console.log('Query:', req.query);
	console.log('Body:', req.body);
	console.log('===============================');
	next();
});

// Roles CRUD
router.post('/roles', async (req, res) => {
	try {
		const role = await TestSuperadminRole.create(req.body);
		res.status(201).json(role);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/roles', async (req, res) => {
	try {
		const roles = await TestSuperadminRole.findAll();
		res.json(roles);
	} catch (error) {
		console.error('Error in sidebar-menu route:', error);
		console.error('Error in sidebar-menu route:', error);
        res.status(500).json({ error: error.message });
	}
});

router.get('/roles/:id', async (req, res) => {
	try {
		const role = await TestSuperadminRole.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });
		res.json(role);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/roles/:id', async (req, res) => {
	try {
		const role = await TestSuperadminRole.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });
		await role.update(req.body);
		res.json(role);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/roles/:id', async (req, res) => {
	try {
		const role = await TestSuperadminRole.findByPk(req.params.id);
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
		const menu = await TestSuperadminSidebarMenu.create(req.body);
		res.status(201).json(menu);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/menus', async (req, res) => {
	try {
		const menus = await TestSuperadminSidebarMenu.findAll({
			where: { is_active: 1 },
			include: [{
				model: TestSuperadminSidebarSubMenu,
				as: 'test_superadmin_sidebar_submenus',
				where: { is_active: 1 },
				required: false
			}]
		});
		res.json(menus);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/menus/:id', async (req, res) => {
	try {
		const menu = await TestSuperadminSidebarMenu.findByPk(req.params.id);
		if (!menu) return res.status(404).json({ error: 'Menu not found' });
		await menu.update(req.body);
		res.json(menu);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/menus/:id', async (req, res) => {
	try {
		const menu = await TestSuperadminSidebarMenu.findByPk(req.params.id);
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
		const submenu = await TestSuperadminSidebarSubMenu.create(req.body);
		res.status(201).json(submenu);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/submenus', async (req, res) => {
	try {
		const submenus = await TestSuperadminSidebarSubMenu.findAll({
			include: [TestSuperadminSidebarMenu]
		});
		res.json(submenus);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/submenus/:id', async (req, res) => {
	try {
		const submenu = await TestSuperadminSidebarSubMenu.findByPk(req.params.id);
		if (!submenu) return res.status(404).json({ error: 'Submenu not found' });
		await submenu.update(req.body);
		res.json(submenu);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/submenus/:id', async (req, res) => {
	try {
		const submenu = await TestSuperadminSidebarSubMenu.findByPk(req.params.id);
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
		const permission = await TestSuperadminRolePermission.create(req.body);
		res.status(201).json(permission);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/permissions', async (req, res) => {
	try {
		const permissions = await TestSuperadminRolePermission.findAll({
			include: [{
				model: TestSuperadminRole,
				as: 'test_superadmin_role'
			}, {
				model: TestSuperadminSidebarMenu,
				as: 'test_superadmin_sidebar_menu'
			}, {
				model: TestSuperadminSidebarSubMenu,
				as: 'test_superadmin_sidebar_submenu'
			}]
		});
		res.json(permissions);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/permissions/:id', async (req, res) => {
	try {
		const permission = await TestSuperadminRolePermission.findByPk(req.params.id);
		if (!permission) return res.status(404).json({ error: 'Permission not found' });
		await permission.update(req.body);
		res.json(permission);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete('/permissions/:id', async (req, res) => {
	try {
		const permission = await TestSuperadminRolePermission.findByPk(req.params.id);
		if (!permission) return res.status(404).json({ error: 'Permission not found' });
		await permission.destroy();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single menu by ID
router.get('/sidebar-menu/single/:id', async (req, res) => {
	try {
		const menu = await TestSuperadminSidebarMenu.findByPk(req.params.id, {
			include: [{
				model: TestSuperadminSidebarSubMenu,
				as: 'test_superadmin_sidebar_submenus',
				where: { is_active: 1 },
				required: false
			}]
		});
		
		if (!menu) {
			return res.status(404).json({ error: 'Menu not found' });
		}
		
		res.json(menu);
	} catch (error) {
		console.error('Error fetching menu:', error);
		res.status(500).json({ error: error.message });
	}
});

// Sidebar menu with permissions endpoint
router.get('/sidebar-menu/:roleId', async (req, res) => {
	try {
		console.log('=== Sidebar Menu Route ===');
		console.log('Role ID:', req.params.roleId);
		
		// Verify role exists
		const role = await TestSuperadminRole.findByPk(req.params.roleId);
		if (!role) {
			console.log('Role not found for ID:', req.params.roleId);
			return res.status(404).json({ error: 'Role not found' });
		}
		console.log('Found role:', role.toJSON());
		
		// Get menus with sub-menus
		const menus = await TestSuperadminSidebarMenu.findAll({
			where: { is_active: 1 },
			include: [{
				model: TestSuperadminSidebarSubMenu,
				as: 'test_superadmin_sidebar_submenus',
				where: { is_active: 1 },
				required: false
			}]
		});
		console.log('Found menus count:', menus.length);

		// Get permissions
		const permissions = await TestSuperadminRolePermission.findAll({
			where: { role_id: req.params.roleId }
		});
		console.log('Found permissions count:', permissions.length);

		// Format response
		const formattedMenus = menus.map(menu => {
			const menuData = menu.toJSON();
			menuData.submenus = (menuData.test_superadmin_sidebar_submenus || []).map(submenu => {
				const permission = permissions.find(p => 
					p.superadmin_sidebar_menu_id === menu.id && 
					p.superadmin_sidebar_sub_menu_id === submenu.id
				) || {};

				return {
					id: submenu.id,
					menuName: submenu.menu,
					url: submenu.url,
					key: submenu.key,
					langKey: submenu.lang_key,
					level: submenu.level,
					isActive: submenu.is_active === 1,
					permissions: {
						canView: permission.can_view === 1,
						canAdd: permission.can_add === 1,
						canEdit: permission.can_edit === 1,
						canDelete: permission.can_delete === 1
					}
				};
			});

			delete menuData.test_superadmin_sidebar_submenus;
			return {
				id: menuData.id,
				menuName: menuData.menu,
				icon: menuData.icon,
				langKey: menuData.lang_key,
				level: menuData.level,
				isActive: menuData.is_active === 1,
				sidebarDisplay: menuData.sidebar_display === 1,
				submenus: menuData.submenus
			};
		});

		res.json(formattedMenus);
	} catch (error) {
		console.error('Error in sidebar-menu route:', error);
		console.error('Stack trace:', error.stack);
		res.status(500).json({ 
			error: error.message,
			stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
});

module.exports = router;