const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all superadmin sidebar menus with their submenus
router.get('/superadmin-sidebar-combined', async (req, res) => {
	try {
		const query = `
			SELECT 
				m.*,
				GROUP_CONCAT(
					CONCAT(
						'{"id":', IFNULL(sm.id, 'null'),
						',"menu":"', IFNULL(sm.menu, ''),
						'","key":"', IFNULL(sm.key, ''),
						'","lang_key":"', IFNULL(sm.lang_key, ''),
						'","url":"', IFNULL(sm.url, ''),
						'","level":', IFNULL(sm.level, 'null'),
						',"access_permissions":"', IFNULL(sm.access_permissions, ''),
						'","permission_group_id":', IFNULL(sm.permission_group_id, 'null'),
						',"activate_controller":"', IFNULL(sm.activate_controller, ''),
						'","activate_methods":"', IFNULL(sm.activate_methods, ''),
						'","addon_permission":', IFNULL(CONCAT('"', sm.addon_permission, '"'), 'null'),
						',"is_active":', IFNULL(sm.is_active, 1),
						'}'
					)
				) as submenus
			FROM superadmin_sidebar_menus m
			LEFT JOIN superadmin_sidebar_sub_menus sm ON m.id = sm.superadmin_sidebar_menu_id
			GROUP BY m.id`;

		const [results] = await db.query(query);
		
		const formattedResults = results.map(menu => ({
			...menu,
			submenus: menu.submenus ? JSON.parse(`[${menu.submenus}]`) : []
		}));

		res.json({
			success: true,
			data: formattedResults
		});
	} catch (error) {
		console.error('Error fetching combined sidebar data:', error);
		res.status(500).json({
			success: false,
			message: 'Error fetching sidebar data',
			error: error.message
		});
	}
});

// Get single superadmin sidebar menu with its submenus
router.get('/superadmin-sidebar-combined/:id', async (req, res) => {
	try {
		const menuId = req.params.id;
		const query = `
			SELECT 
				m.*,
				GROUP_CONCAT(
					CONCAT(
						'{"id":', IFNULL(sm.id, 'null'),
						',"menu":"', IFNULL(sm.menu, ''),
						'","key":"', IFNULL(sm.key, ''),
						'","lang_key":"', IFNULL(sm.lang_key, ''),
						'","url":"', IFNULL(sm.url, ''),
						'","level":', IFNULL(sm.level, 'null'),
						',"access_permissions":"', IFNULL(sm.access_permissions, ''),
						'","permission_group_id":', IFNULL(sm.permission_group_id, 'null'),
						',"activate_controller":"', IFNULL(sm.activate_controller, ''),
						'","activate_methods":"', IFNULL(sm.activate_methods, ''),
						'","addon_permission":', IFNULL(CONCAT('"', sm.addon_permission, '"'), 'null'),
						',"is_active":', IFNULL(sm.is_active, 1),
						'}'
					)
				) as submenus
			FROM superadmin_sidebar_menus m
			LEFT JOIN superadmin_sidebar_sub_menus sm ON m.id = sm.superadmin_sidebar_menu_id
			WHERE m.id = ?
			GROUP BY m.id`;

		const [results] = await db.query(query, [menuId]);
		
		if (results.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Menu not found'
			});
		}

		const formattedResult = {
			...results[0],
			submenus: results[0].submenus ? JSON.parse(`[${results[0].submenus}]`) : []
		};

		res.json({
			success: true,
			data: formattedResult
		});
	} catch (error) {
		console.error('Error fetching sidebar menu:', error);
		res.status(500).json({
			success: false,
			message: 'Error fetching sidebar menu',
			error: error.message
		});
	}
});

// Create superadmin sidebar menu with submenus
router.post('/superadmin-sidebar-combined', async (req, res) => {
	try {
		const { menu, submenus } = req.body;

		// Start transaction
		await db.query('START TRANSACTION');

		// Insert main menu
		const [menuResult] = await db.query(
			'INSERT INTO superadmin_sidebar_menus SET ?',
			[menu]
		);

		// Insert submenus if any
		if (submenus && submenus.length > 0) {
			const submenuValues = submenus.map(submenu => ({
				...submenu,
				superadmin_sidebar_menu_id: menuResult.insertId
			}));

			await db.query(
				'INSERT INTO superadmin_sidebar_sub_menus (superadmin_sidebar_menu_id, menu, `key`, lang_key, url, level, access_permissions, permission_group_id, activate_controller, activate_methods, addon_permission, is_active) VALUES ?',
                [submenuValues.map(submenu => [
                    submenu.superadmin_sidebar_menu_id,
                    submenu.menu,
                    submenu.key,
                    submenu.lang_key,
                    submenu.url,
                    submenu.level,
                    submenu.access_permissions,
                    submenu.permission_group_id,
                    submenu.activate_controller,
                    submenu.activate_methods,
                    submenu.addon_permission,
                    submenu.is_active || 1
                ])]
            );
        }

        // Commit transaction
        await db.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Menu and submenus created successfully',
            menuId: menuResult.insertId
        });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        console.error('Error creating sidebar menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating sidebar menu',
            error: error.message
        });
    }
});

module.exports = router;