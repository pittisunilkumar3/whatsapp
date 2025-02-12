const express = require('express');
const router = express.Router();
const SidebarMenu = require('../models/SidebarMenu');
const SidebarSubMenu = require('../models/SidebarSubMenu');
const db = require('../../db');

// Get all sidebar menus with their sub-menus
router.get('/menus-with-submenus', async (req, res) => {
	try {
		// First get all menus
		const [menus] = await db.query('SELECT * FROM sidebar_menus');
		
		// For each menu, get its sub-menus
		const menusWithSubMenus = await Promise.all(menus.map(async (menu) => {
			const [subMenus] = await db.query(
				'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ?',
				[menu.id]
			);
			return {
				...menu,
				sub_menus: subMenus
			};
		}));

		res.json({ data: menusWithSubMenus });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Get single sidebar menu with its sub-menus
router.get('/menu-with-submenus/:id', async (req, res) => {
	try {
		// Get the menu
		const [menus] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[req.params.id]
		);
		
		if (menus.length === 0) {
			return res.status(404).json({ message: 'Sidebar menu not found' });
		}

		// Get its sub-menus
		const [subMenus] = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ?',
			[req.params.id]
		);

		const result = {
			...menus[0],
			sub_menus: subMenus
		};

		res.json({ data: result });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Create sidebar menu with sub-menus
router.post('/create-menu-with-submenus', async (req, res) => {
	try {
		const { menu, subMenus } = req.body;

		// Create the main menu first
		const [menuResult] = await SidebarMenu.create(menu);
		const menuId = menuResult.insertId;

		// Add menu ID to each submenu
		const subMenusWithParent = subMenus.map(subMenu => ({
			...subMenu,
			sidebar_menu_id: menuId
		}));

		// Create all submenus
		await SidebarSubMenu.bulkCreate(subMenusWithParent);

		// Fetch the created menu with its submenus
		const [createdMenu] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[menuId]
		);
		
		const [createdSubMenus] = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ?',
			[menuId]
		);

		res.status(201).json({
			data: {
				...createdMenu[0],
				sub_menus: createdSubMenus
			}
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Delete sidebar menu with its sub-menus
router.delete('/delete-menu-with-submenus/:id', async (req, res) => {
	try {
		const menuId = req.params.id;
		
		// First check if menu exists
		const [menu] = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[menuId]
		);
		
		if (menu.length === 0) {
			return res.status(404).json({ message: 'Sidebar menu not found' });
		}

		// Delete all associated sub-menus first
		await db.query(
			'DELETE FROM sidebar_sub_menus WHERE sidebar_menu_id = ?',
			[menuId]
		);

		// Then delete the menu
		await db.query(
			'DELETE FROM sidebar_menus WHERE id = ?',
			[menuId]
		);

		res.json({ message: 'Menu and associated sub-menus deleted successfully' });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

