const db = require('../../db');

class SuperAdminSidebarMenu {
	static async create(menuData) {
		const query = `
			INSERT INTO superadmin_sidebar_menus 
			(permission_group_id, icon, menu, activate_menu, lang_key, system_level, level, 
			sidebar_display, access_permissions, is_active) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const values = [
			menuData.permission_group_id,
			menuData.icon,
			menuData.menu,
			menuData.activate_menu,
			menuData.lang_key,
			menuData.system_level,
			menuData.level,
			menuData.sidebar_display,
			menuData.access_permissions,
			menuData.is_active
		];

		try {
			const result = await db.query(query, values);
			return result.insertId;
		} catch (error) {
			throw error;
		}
	}

	static async getAll() {
		const query = 'SELECT * FROM superadmin_sidebar_menus WHERE is_active = 1';
		try {
			const [rows] = await db.query(query);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	static async getById(id) {
		const query = 'SELECT * FROM superadmin_sidebar_menus WHERE id = ?';
		try {
			const [rows] = await db.query(query, [id]);
			return rows[0];
		} catch (error) {
			throw error;
		}
	}

	static async update(id, menuData) {
		const query = `
			UPDATE superadmin_sidebar_menus 
			SET permission_group_id = ?, icon = ?, menu = ?, activate_menu = ?, 
				lang_key = ?, system_level = ?, level = ?, sidebar_display = ?, 
				access_permissions = ?, is_active = ?
			WHERE id = ?
		`;
		const values = [
			menuData.permission_group_id,
			menuData.icon,
			menuData.menu,
			menuData.activate_menu,
			menuData.lang_key,
			menuData.system_level,
			menuData.level,
			menuData.sidebar_display,
			menuData.access_permissions,
			menuData.is_active,
			id
		];

		try {
			const result = await db.query(query, values);
			return result.affectedRows > 0;
		} catch (error) {
			throw error;
		}
	}

	static async delete(id) {
		const query = 'UPDATE superadmin_sidebar_menus SET is_active = 0 WHERE id = ?';
		try {
			const result = await db.query(query, [id]);
			return result.affectedRows > 0;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = SuperAdminSidebarMenu;