const express = require('express');
const router = express.Router();
const SidebarMenu = require('../models/SidebarMenu');
const SidebarSubMenu = require('../models/SidebarSubMenu');
const db = require('../../db');

// Get all sidebar menus with their sub-menus for a specific company
router.get('/company/:companyId/menus-with-submenus', async (req, res) => {
	try {
		console.log('Fetching menus for company:', req.params.companyId);
		
		// Get all menus for the company
		const [menus] = await db.query(
			'SELECT * FROM sidebar_menus WHERE company_id = ?',
			[req.params.companyId]
		);
		console.log('Found menus:', menus);
		
		// For each menu, get its sub-menus
		const menusWithSubMenus = await Promise.all(menus.map(async (menu) => {
			console.log('Fetching sub-menus for menu:', menu.id);
			const [subMenus] = await db.query(
				'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ? AND company_id = ?',
				[menu.id, req.params.companyId]
			);
			console.log('Found sub-menus:', subMenus);
			return {
				...menu,
				sub_menus: subMenus
			};
		}));

		res.json({ data: menusWithSubMenus });
	} catch (error) {
		console.error('Database Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Get all sidebar menus with their sub-menus
router.get('/menus-with-submenus', async (req, res) => {
	try {
		console.log('Fetching all sidebar menus');
		const [menus] = await db.query('SELECT * FROM sidebar_menus');
		console.log('Found menus:', menus);
		
		const menusWithSubMenus = await Promise.all(menus.map(async (menu) => {
			console.log('Fetching sub-menus for menu:', menu.id);
			const [subMenus] = await db.query(
				'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ? AND company_id = ?',
				[menu.id, menu.company_id]
			);
			console.log('Found sub-menus for menu', menu.id, ':', subMenus);
			return {
				...menu,
				sub_menus: subMenus
			};
		}));

		res.json({ data: menusWithSubMenus });

	} catch (error) {
		console.error('Database Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Get single sidebar menu with its sub-menus
router.get('/menu-with-submenus/:id', async (req, res) => {
	try {
		console.log('Fetching menu with id:', req.params.id);
		// Get the menu
		const [menus] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[req.params.id]
		);
		console.log('Found menu:', menus);
		
		if (menus.length === 0) {
			console.log('No menu found with id:', req.params.id);
			return res.status(404).json({ message: 'Sidebar menu not found' });
		}

		// Get its sub-menus
		console.log('Fetching sub-menus for menu:', req.params.id);
		const [subMenus] = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ? AND company_id = ?',
			[req.params.id, menus[0].company_id]
		);
		console.log('Found sub-menus:', subMenus);

		const result = {
			...menus[0],
			sub_menus: subMenus
		};

		res.json({ data: result });
	} catch (error) {
		console.error('Database Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Create sidebar menu with sub-menus
router.post('/create-menu-with-submenus', async (req, res) => {
	try {
		const { menu, subMenus } = req.body;
		console.log('Creating new menu:', menu);

		const [menuResult] = await SidebarMenu.create(menu);
		const menuId = menuResult.insertId;
		console.log('Created menu with id:', menuId);

		const subMenusWithParent = subMenus.map(subMenu => ({
			...subMenu,
			sidebar_menu_id: menuId,
			company_id: menu.company_id
		}));
		console.log('Creating sub-menus:', subMenusWithParent);

		await SidebarSubMenu.bulkCreate(subMenusWithParent);
		console.log('Created sub-menus successfully');

		console.log('Fetching created menu details');
		const [createdMenu] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[menuId]
		);
		
		console.log('Fetching created sub-menus');
		const [createdSubMenus] = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ? AND company_id = ?',
			[menuId, menu.company_id]
		);

		res.status(201).json({
			data: {
				...createdMenu[0],
				sub_menus: createdSubMenus
			}
		});

	} catch (error) {
		console.error('Database Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Delete sidebar menu with its sub-menus
router.delete('/delete-menu-with-submenus/:id', async (req, res) => {
	try {
		const menuId = req.params.id;
		console.log('Attempting to delete menu with id:', menuId);
		
		const [menu] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[menuId]
		);
		console.log('Found menu:', menu);
		
		if (menu.length === 0) {
			console.log('No menu found with id:', menuId);
			return res.status(404).json({ message: 'Sidebar menu not found' });
		}

		console.log('Deleting sub-menus for menu:', menuId);
		await db.query(
			'DELETE FROM sidebar_sub_menus WHERE sidebar_menu_id = ? AND company_id = ?',
			[menuId, menu[0].company_id]
		);

		console.log('Deleting menu:', menuId);
		await db.query(
			'DELETE FROM sidebar_menus WHERE id = ?',
			[menuId]
		);

		console.log('Successfully deleted menu and sub-menus');
		res.json({ message: 'Menu and associated sub-menus deleted successfully' });

	} catch (error) {
		console.error('Database Error:', error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

