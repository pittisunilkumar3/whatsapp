const db = require('../../db');

class SuperAdminSidebarSubMenu {
	static async create(subMenuData) {
		const query = `
			INSERT INTO superadmin_sidebar_sub_menus 
			(superadmin_sidebar_menu_id, menu, \`key\`, lang_key, url, level, access_permissions,
			permission_group_id, activate_controller, activate_methods, addon_permission, is_active) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const values = [
			subMenuData.superadmin_sidebar_menu_id,
			subMenuData.menu,
			subMenuData.key,
			subMenuData.lang_key,
			subMenuData.url,
			subMenuData.level,
			subMenuData.access_permissions,
			subMenuData.permission_group_id,
			subMenuData.activate_controller,
			subMenuData.activate_methods,
			subMenuData.addon_permission,
			subMenuData.is_active
		];

		try {
			const result = await db.query(query, values);
			return result.insertId;
		} catch (error) {
			throw error;
		}
	}

	static async getAll() {
		const query = 'SELECT * FROM superadmin_sidebar_sub_menus WHERE is_active = 1';
		try {
			const [rows] = await db.query(query);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	static async getById(id) {
		const query = 'SELECT * FROM superadmin_sidebar_sub_menus WHERE id = ?';
		try {
			const [rows] = await db.query(query, [id]);
			return rows[0];
		} catch (error) {
			throw error;
		}
	}

	static async getByMenuId(menuId) {
		const query = 'SELECT * FROM superadmin_sidebar_sub_menus WHERE superadmin_sidebar_menu_id = ? AND is_active = 1';
		try {
			const [rows] = await db.query(query, [menuId]);
			return rows;
		} catch (error) {
			throw error;
		}
	}

	static async update(id, subMenuData) {
		const query = `
			UPDATE superadmin_sidebar_sub_menus 
			SET superadmin_sidebar_menu_id = ?, menu = ?, \`key\` = ?, lang_key = ?, url = ?, 
				level = ?, access_permissions = ?, permission_group_id = ?, 
				activate_controller = ?, activate_methods = ?, addon_permission = ?, 
				is_active = ?
			WHERE id = ?
		`;
		const values = [
			subMenuData.superadmin_sidebar_menu_id,
			subMenuData.menu,
			subMenuData.key,
			subMenuData.lang_key,
			subMenuData.url,
			subMenuData.level,
			subMenuData.access_permissions,
			subMenuData.permission_group_id,
			subMenuData.activate_controller,
			subMenuData.activate_methods,
			subMenuData.addon_permission,
			subMenuData.is_active,
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
		const query = 'UPDATE superadmin_sidebar_sub_menus SET is_active = 0 WHERE id = ?';
		try {
			const result = await db.query(query, [id]);
			return result.affectedRows > 0;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = SuperAdminSidebarSubMenu;