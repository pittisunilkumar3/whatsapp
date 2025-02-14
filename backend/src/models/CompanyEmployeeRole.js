const db = require('../../db');

class CompanyEmployeeRole {
	static async create(data) {
		const query = `INSERT INTO company_employee_roles 
					  (company_id, role_id, staff_id, is_active, updated_at) 
					  VALUES (?, ?, ?, ?, CURDATE())`;
		const values = [data.company_id, data.role_id, data.staff_id, data.is_active || 0];
		return db.query(query, values);
	}

	static async findById(id) {
		const query = `SELECT * FROM company_employee_roles WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async findByCompanyId(companyId) {
		const query = `SELECT * FROM company_employee_roles WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findByStaffId(staffId) {
		const query = `SELECT * FROM company_employee_roles WHERE staff_id = ?`;
		return db.query(query, [staffId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM company_employee_roles WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.role_id) {
			query += ` AND role_id = ?`;
			values.push(filters.role_id);
		}

		if (filters.staff_id) {
			query += ` AND staff_id = ?`;
			values.push(filters.staff_id);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		return db.query(query, values);
	}

	static async update(id, data) {
		const query = `UPDATE company_employee_roles 
					  SET company_id = ?, role_id = ?, staff_id = ?, 
						  is_active = ?, updated_at = CURDATE() 
					  WHERE id = ?`;
		const values = [data.company_id, data.role_id, data.staff_id, data.is_active, id];
		return db.query(query, values);
	}

	static async delete(id) {
		const query = `DELETE FROM company_employee_roles WHERE id = ?`;
		return db.query(query, [id]);
	}

	static async toggleActive(id, isActive) {
		const query = `UPDATE company_employee_roles 
					  SET is_active = ?, updated_at = CURDATE() 
					  WHERE id = ?`;
		return db.query(query, [isActive, id]);
	}
}

module.exports = CompanyEmployeeRole;