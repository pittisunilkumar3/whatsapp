const db = require('../../db');

class EmailConfig {
	static async getAll() {
		const query = `
			SELECT ec.*, c.name as company_name 
			FROM email_config ec 
			JOIN companies c ON ec.company_id = c.id
		`;
		const [configs] = await db.query(query);
		return configs;
	}

	static async getById(id) {
		const query = `
			SELECT ec.*, c.name as company_name 
			FROM email_config ec 
			JOIN companies c ON ec.company_id = c.id 
			WHERE ec.id = ?
		`;
		const [config] = await db.query(query, [id]);
		return config[0];
	}

	static async getByCompanyId(companyId) {
		const query = `
			SELECT ec.*, c.name as company_name 
			FROM email_config ec 
			JOIN companies c ON ec.company_id = c.id 
			WHERE ec.company_id = ?
		`;
		const [configs] = await db.query(query, [companyId]);
		return configs;
	}

	static async create(configData) {
		const query = `
			INSERT INTO email_config 
			(company_id, email_type, smtp_server, smtp_port, smtp_username, 
			smtp_password, ssl_tls, smtp_auth, api_key, api_secret, 
			region, is_active) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const [result] = await db.query(query, [
			configData.company_id,
			configData.email_type,
			configData.smtp_server,
			configData.smtp_port,
			configData.smtp_username,
			configData.smtp_password,
			configData.ssl_tls,
			configData.smtp_auth,
			configData.api_key,
			configData.api_secret,
			configData.region,
			configData.is_active || 'no'
		]);
		return result.insertId;
	}

	static async update(id, configData) {
		const query = `
			UPDATE email_config 
			SET company_id = ?, email_type = ?, smtp_server = ?, 
				smtp_port = ?, smtp_username = ?, smtp_password = ?, 
				ssl_tls = ?, smtp_auth = ?, api_key = ?, 
				api_secret = ?, region = ?, is_active = ?
			WHERE id = ?
		`;
		const [result] = await db.query(query, [
			configData.company_id,
			configData.email_type,
			configData.smtp_server,
			configData.smtp_port,
			configData.smtp_username,
			configData.smtp_password,
			configData.ssl_tls,
			configData.smtp_auth,
			configData.api_key,
			configData.api_secret,
			configData.region,
			configData.is_active,
			id
		]);
		return result.affectedRows > 0;
	}

	static async delete(id) {
		const query = 'DELETE FROM email_config WHERE id = ?';
		const [result] = await db.query(query, [id]);
		return result.affectedRows > 0;
	}
}

module.exports = EmailConfig;