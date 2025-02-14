const db = require('../../db');

class SuperadminRolePermission {
	static async create(data) {
		const query = `INSERT INTO superadmin_roles_permissions 
					  (role_id, superadmin_sidebar_menu_id, superadmin_sidebar_sub_menu_id,
					   can_view, can_add, can_edit, can_delete) 
					  VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			data.role_id,
			data.superadmin_sidebar_menu_id,
			data.superadmin_sidebar_sub_menu_id,
			data.can_view || 0,
			data.can_add || 0,
			data.can_edit || 0,
			data.can_delete || 0
		];
		return db.query(query, values);
	}

	static async findById(id) {
		const query = `SELECT * FROM superadmin_roles_permissions WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async findByRole(roleId) {
		const query = `SELECT * FROM superadmin_roles_permissions WHERE role_id = ?`;
		return db.query(query, [roleId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM superadmin_roles_permissions WHERE 1=1`;
		const values = [];

		if (filters.role_id) {
			query += ` AND role_id = ?`;
			values.push(filters.role_id);
		}

		if (filters.superadmin_sidebar_menu_id) {
			query += ` AND superadmin_sidebar_menu_id = ?`;
			values.push(filters.superadmin_sidebar_menu_id);
		}

		if (filters.superadmin_sidebar_sub_menu_id) {
			query += ` AND superadmin_sidebar_sub_menu_id = ?`;
			values.push(filters.superadmin_sidebar_sub_menu_id);
		}

		return db.query(query, values);
	}

	static async update(id, data) {
		const query = `UPDATE superadmin_roles_permissions 
					  SET role_id = ?, superadmin_sidebar_menu_id = ?, 
						  superadmin_sidebar_sub_menu_id = ?, can_view = ?,
						  can_add = ?, can_edit = ?, can_delete = ?
					  WHERE id = ?`;
		const values = [
			data.role_id,
			data.superadmin_sidebar_menu_id,
			data.superadmin_sidebar_sub_menu_id,
			data.can_view,
			data.can_add,
			data.can_edit,
			data.can_delete,
			id
		];
		return db.query(query, values);
	}

	static async delete(id) {
		const query = `DELETE FROM superadmin_roles_permissions WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async deleteByRole(roleId) {
		const query = `DELETE FROM superadmin_roles_permissions WHERE role_id = ?`;
		return db.query(query, [roleId]);
	}
}

module.exports = SuperadminRolePermission;