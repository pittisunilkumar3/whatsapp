const express = require('express');
const router = express.Router();
const SuperAdminSidebarMenu = require('../models/SuperAdminSidebarMenu');

/**
 * @api {post} /api/superadmin-sidebar-menus Create new sidebar menu
 * @apiDescription Create a new superadmin sidebar menu
 * @apiBody {Number} permission_group_id Permission group ID
 * @apiBody {String} icon Menu icon
 * @apiBody {String} menu Menu name
 * @apiBody {String} activate_menu Activate menu identifier
 * @apiBody {String} lang_key Language key
 * @apiBody {Number} system_level System level
 * @apiBody {Number} level Menu level
 * @apiBody {Number} sidebar_display Sidebar display flag
 * @apiBody {String} access_permissions Access permissions
 * @apiBody {Number} is_active Active status
 */
router.post('/', async (req, res) => {
	try {
		const menuId = await SuperAdminSidebarMenu.create(req.body);
		res.status(201).json({ success: true, id: menuId });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {get} /api/superadmin-sidebar-menus Get all sidebar menus
 * @apiDescription Retrieve all active superadmin sidebar menus
 */
router.get('/', async (req, res) => {
	try {
		const menus = await SuperAdminSidebarMenu.getAll();
		res.json({ success: true, data: menus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {get} /api/superadmin-sidebar-menus/:id Get sidebar menu by ID
 * @apiDescription Retrieve a specific superadmin sidebar menu by ID
 * @apiParam {Number} id Menu ID
 */
router.get('/:id', async (req, res) => {
	try {
		const menu = await SuperAdminSidebarMenu.getById(req.params.id);
		if (!menu) {
			return res.status(404).json({ success: false, message: 'Menu not found' });
		}
		res.json({ success: true, data: menu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {put} /api/superadmin-sidebar-menus/:id Update sidebar menu
 * @apiDescription Update an existing superadmin sidebar menu
 * @apiParam {Number} id Menu ID
 * @apiBody {Number} [permission_group_id] Permission group ID
 * @apiBody {String} [icon] Menu icon
 * @apiBody {String} [menu] Menu name
 * @apiBody {String} [activate_menu] Activate menu identifier
 * @apiBody {String} [lang_key] Language key
 * @apiBody {Number} [system_level] System level
 * @apiBody {Number} [level] Menu level
 * @apiBody {Number} [sidebar_display] Sidebar display flag
 * @apiBody {String} [access_permissions] Access permissions
 * @apiBody {Number} [is_active] Active status
 */
router.put('/:id', async (req, res) => {
	try {
		const success = await SuperAdminSidebarMenu.update(req.params.id, req.body);
		if (!success) {
			return res.status(404).json({ success: false, message: 'Menu not found' });
		}
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {delete} /api/superadmin-sidebar-menus/:id Delete sidebar menu
 * @apiDescription Soft delete a superadmin sidebar menu
 * @apiParam {Number} id Menu ID
 */
router.delete('/:id', async (req, res) => {
	try {
		const success = await SuperAdminSidebarMenu.delete(req.params.id);
		if (!success) {
			return res.status(404).json({ success: false, message: 'Menu not found' });
		}
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;