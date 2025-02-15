const db = require('../../db');

class CompanyRole {
	static async create(data) {
		const query = `
			INSERT INTO company_roles 
			(company_id, name, slug, is_active, is_system, is_superadmin, updated_at) 
			VALUES (?, ?, ?, ?, ?, ?, CURDATE())
		`;
		const values = [
			data.company_id,
			data.name,
			data.slug,
			data.is_active || 0,
			data.is_system || 0,
			data.is_superadmin || 0
		];
		const [result] = await db.query(query, values);
		return { ...data, id: result.insertId };
	}

	static async findAll(filters = {}) {
		let query = 'SELECT * FROM company_roles WHERE 1=1';
		const values = [];

		if (filters.company_id) {
			query += ' AND company_id = ?';
			values.push(filters.company_id);
		}
		if (filters.is_active !== undefined) {
			query += ' AND is_active = ?';
			values.push(filters.is_active);
		}
		if (filters.is_system !== undefined) {
			query += ' AND is_system = ?';
			values.push(filters.is_system);
		}

		return db.query(query, values);
	}

	static async findById(id) {
		const query = 'SELECT * FROM company_roles WHERE id = ?';
		return db.query(query, [id]);
	}

	static async update(id, data) {
		const query = `
			UPDATE company_roles 
			SET company_id = ?, name = ?, slug = ?, is_active = ?, 
				is_system = ?, is_superadmin = ?, updated_at = CURDATE()
			WHERE id = ?
		`;
		const values = [
			data.company_id,
			data.name,
			data.slug,
			data.is_active,
			data.is_system,
			data.is_superadmin,
			id
		];
		const [result] = await db.query(query, values);
		return result.affectedRows > 0;
	}

	static async delete(id) {
		const query = 'DELETE FROM company_roles WHERE id = ?';
		const [result] = await db.query(query, [id]);
		return result.affectedRows > 0;
	}

	static async toggleActive(id, isActive) {
		const query = 'UPDATE company_roles SET is_active = ?, updated_at = CURDATE() WHERE id = ?';
		const [result] = await db.query(query, [isActive, id]);
		return result.affectedRows > 0;
	}
}

module.exports = CompanyRole;