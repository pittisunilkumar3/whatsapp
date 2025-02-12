const db = require('../../db');

class CompanyEmployee {
	static async create(employeeData) {
		const query = `
			INSERT INTO company_employee SET ?
		`;
		return db.query(query, [employeeData]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM company_employee WHERE id = ?', [id]);
	}

	static async findByEmail(email) {
		return db.query('SELECT * FROM company_employee WHERE email = ?', [email]);
	}

	static async findByCompanyId(companyId) {
		return db.query('SELECT * FROM company_employee WHERE company_id = ?', [companyId]);
	}

	static async findAll(filters = {}) {
		let query = 'SELECT * FROM company_employee WHERE 1=1';
		const values = [];

		if (filters.company_id) {
			query += ' AND company_id = ?';
			values.push(filters.company_id);
		}

		if (filters.department) {
			query += ' AND department = ?';
			values.push(filters.department);
		}

		if (filters.designation) {
			query += ' AND designation = ?';
			values.push(filters.designation);
		}

		if (filters.is_active !== undefined) {
			query += ' AND is_active = ?';
			values.push(filters.is_active);
		}

		return db.query(query, values);
	}

	static async update(id, employeeData) {
		const query = `
			UPDATE company_employee 
			SET ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`;
		return db.query(query, [employeeData, id]);
	}

	static async delete(id) {
		return db.query('DELETE FROM company_employee WHERE id = ?', [id]);
	}
}

module.exports = CompanyEmployee;