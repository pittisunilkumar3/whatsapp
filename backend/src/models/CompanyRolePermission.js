const db = require('../../db');

class CompanyRolePermission {
	static async create(data) {
		const query = `INSERT INTO company_roles_permissions 
					  (company_id, company_roles_role_id, sidebar_menu_id, 
					   sidebar_sub_menu_id, can_view, can_add, can_edit, can_delete) 
					  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			data.company_id,
			data.company_roles_role_id,
			data.sidebar_menu_id,
			data.sidebar_sub_menu_id,
			data.can_view || 0,
			data.can_add || 0,
			data.can_edit || 0,
			data.can_delete || 0
		];
		return db.query(query, values);
	}

	static async findById(id) {
		const query = `SELECT * FROM company_roles_permissions WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async findByCompanyRole(companyId, roleId) {
		const query = `SELECT * FROM company_roles_permissions 
					  WHERE company_id = ? AND company_roles_role_id = ?`;
		return db.query(query, [companyId, roleId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM company_roles_permissions WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.company_roles_role_id) {
			query += ` AND company_roles_role_id = ?`;
			values.push(filters.company_roles_role_id);
		}

		if (filters.sidebar_menu_id) {
			query += ` AND sidebar_menu_id = ?`;
			values.push(filters.sidebar_menu_id);
		}

		if (filters.sidebar_sub_menu_id) {
			query += ` AND sidebar_sub_menu_id = ?`;
			values.push(filters.sidebar_sub_menu_id);
		}

		return db.query(query, values);
	}

	static async update(id, data) {
		const query = `UPDATE company_roles_permissions 
					  SET company_id = ?, company_roles_role_id = ?, 
						  sidebar_menu_id = ?, sidebar_sub_menu_id = ?,
						  can_view = ?, can_add = ?, can_edit = ?, can_delete = ?
					  WHERE id = ?`;
		const values = [
			data.company_id,
			data.company_roles_role_id,
			data.sidebar_menu_id,
			data.sidebar_sub_menu_id,
			data.can_view,
			data.can_add,
			data.can_edit,
			data.can_delete,
			id
		];
		return db.query(query, values);
	}

	static async delete(id) {
		const query = `DELETE FROM company_roles_permissions WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async deleteByCompanyRole(companyId, roleId) {
		const query = `DELETE FROM company_roles_permissions 
					  WHERE company_id = ? AND company_roles_role_id = ?`;
		return db.query(query, [companyId, roleId]);
	}
}

module.exports = CompanyRolePermission;