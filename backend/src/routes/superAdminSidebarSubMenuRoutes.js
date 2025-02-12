const express = require('express');
const router = express.Router();
const SuperAdminSidebarSubMenu = require('../models/SuperAdminSidebarSubMenu');

/**
 * @api {post} /api/superadmin-sidebar-sub-menus Create new sub menu
 * @apiDescription Create a new superadmin sidebar sub menu
 * @apiBody {Number} superadmin_sidebar_menu_id Parent menu ID
 * @apiBody {String} menu Sub menu name
 * @apiBody {String} key Menu key
 * @apiBody {String} lang_key Language key
 * @apiBody {String} url Menu URL
 * @apiBody {Number} level Menu level
 * @apiBody {String} access_permissions Access permissions
 * @apiBody {Number} permission_group_id Permission group ID
 * @apiBody {String} activate_controller Controller name
 * @apiBody {String} activate_methods Controller methods
 * @apiBody {String} addon_permission Additional permissions
 * @apiBody {Number} is_active Active status
 */
router.post('/', async (req, res) => {
	try {
		const subMenuId = await SuperAdminSidebarSubMenu.create(req.body);
		res.status(201).json({ success: true, id: subMenuId });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {get} /api/superadmin-sidebar-sub-menus Get all sub menus
 * @apiDescription Retrieve all active superadmin sidebar sub menus
 */
router.get('/', async (req, res) => {
	try {
		const subMenus = await SuperAdminSidebarSubMenu.getAll();
		res.json({ success: true, data: subMenus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {get} /api/superadmin-sidebar-sub-menus/:id Get sub menu by ID
 * @apiDescription Retrieve a specific superadmin sidebar sub menu by ID
 * @apiParam {Number} id Sub Menu ID
 */
router.get('/:id', async (req, res) => {
	try {
		const subMenu = await SuperAdminSidebarSubMenu.getById(req.params.id);
		if (!subMenu) {
			return res.status(404).json({ success: false, message: 'Sub menu not found' });
		}
		res.json({ success: true, data: subMenu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {get} /api/superadmin-sidebar-sub-menus/menu/:menuId Get sub menus by menu ID
 * @apiDescription Retrieve all sub menus for a specific menu
 * @apiParam {Number} menuId Parent Menu ID
 */
router.get('/menu/:menuId', async (req, res) => {
	try {
		const subMenus = await SuperAdminSidebarSubMenu.getByMenuId(req.params.menuId);
		res.json({ success: true, data: subMenus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {put} /api/superadmin-sidebar-sub-menus/:id Update sub menu
 * @apiDescription Update an existing superadmin sidebar sub menu
 * @apiParam {Number} id Sub Menu ID
 */
router.put('/:id', async (req, res) => {
	try {
		const success = await SuperAdminSidebarSubMenu.update(req.params.id, req.body);
		if (!success) {
			return res.status(404).json({ success: false, message: 'Sub menu not found' });
		}
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

/**
 * @api {delete} /api/superadmin-sidebar-sub-menus/:id Delete sub menu
 * @apiDescription Soft delete a superadmin sidebar sub menu
 * @apiParam {Number} id Sub Menu ID
 */
router.delete('/:id', async (req, res) => {
	try {
		const success = await SuperAdminSidebarSubMenu.delete(req.params.id);
		if (!success) {
			return res.status(404).json({ success: false, message: 'Sub menu not found' });
		}
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;