const db = require('../../db');

class CompanyRole {
	static async create(roleData) {
		const query = `INSERT INTO company_roles (company_id, name, slug, is_active, is_system, is_superadmin, updated_at) 
					  VALUES (?, ?, ?, ?, ?, ?, CURDATE())`;
		const values = [roleData.company_id, roleData.name, roleData.slug, roleData.is_active || 0, 
					   roleData.is_system || 0, roleData.is_superadmin || 0];
		return db.query(query, values);
	}

	static async findById(id) {
		const query = `SELECT * FROM company_roles WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async findByCompanyId(companyId) {
		const query = `SELECT * FROM company_roles WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM company_roles WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		if (filters.is_system !== undefined) {
			query += ` AND is_system = ?`;
			values.push(filters.is_system);
		}

		return db.query(query, values);
	}

	static async update(id, roleData) {
		const query = `UPDATE company_roles SET company_id = ?, name = ?, slug = ?, is_active = ?, 
					  is_system = ?, is_superadmin = ?, updated_at = CURDATE() WHERE id = ?`;
		const values = [roleData.company_id, roleData.name, roleData.slug, roleData.is_active, 
					   roleData.is_system, roleData.is_superadmin, id];
		return db.query(query, values);
	}

	static async delete(id) {
		const query = `DELETE FROM company_roles WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async toggleActive(id, isActive) {
		const query = `UPDATE company_roles SET is_active = ?, updated_at = CURDATE() WHERE id = ?`;
		return db.query(query, [isActive, id]);
	}
}

module.exports = CompanyRole;