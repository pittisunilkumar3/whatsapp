const db = require('../../db');

class Company {
	static async create(companyData) {
		const query = `
			INSERT INTO companies SET ?
		`;
		return db.query(query, [companyData]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM companies WHERE id = ?', [id]);
	}

	static async findByUsername(username) {
		return db.query('SELECT * FROM companies WHERE username = ?', [username]);
	}

	static async findAll(filters = {}) {
		let query = 'SELECT * FROM companies WHERE 1=1';
		const values = [];

		if (filters.status) {
			query += ' AND status = ?';
			values.push(filters.status);
		}

		if (filters.industry) {
			query += ' AND industry = ?';
			values.push(filters.industry);
		}

		return db.query(query, values);
	}

	static async update(id, companyData) {
		const query = `
			UPDATE companies 
			SET ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`;
		return db.query(query, [companyData, id]);
	}

	static async delete(id) {
		return db.query('DELETE FROM companies WHERE id = ?', [id]);
	}
}

module.exports = Company;
