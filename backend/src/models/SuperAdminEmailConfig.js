const db = require('../../db');

class SuperAdminEmailConfig {
	static async create(configData) {
		const query = `
			INSERT INTO superadmin_email_config SET ?
		`;
		return db.query(query, [configData]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM superadmin_email_config WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM superadmin_email_config');
	}

	static async update(id, configData) {
		const query = `
			UPDATE superadmin_email_config 
			SET ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`;
		return db.query(query, [configData, id]);
	}

	static async delete(id) {
		return db.query('DELETE FROM superadmin_email_config WHERE id = ?', [id]);
	}
}

module.exports = SuperAdminEmailConfig;
