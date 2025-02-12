const db = require('../../../db');

class CallAgent {
	static async create(agentData) {
		const query = `INSERT INTO call_agents SET ?`;
		return db.query(query, [agentData]);
	}

	static async findById(agentId) {
		const query = `SELECT * FROM call_agents WHERE agent_id = ?`;
		return db.query(query, [agentId]);
	}

	static async findByCompany(companyId) {
		const query = `SELECT * FROM call_agents WHERE company_id = ?`;
		return db.query(query, [companyId]);
	}

	static async findAll(filters = {}) {
		let query = `SELECT * FROM call_agents WHERE 1=1`;
		const values = [];

		if (filters.company_id) {
			query += ` AND company_id = ?`;
			values.push(filters.company_id);
		}

		if (filters.is_active !== undefined) {
			query += ` AND is_active = ?`;
			values.push(filters.is_active);
		}

		return db.query(query, values);
	}

	static async update(agentId, agentData) {
		const query = `UPDATE call_agents SET ? WHERE agent_id = ?`;
		return db.query(query, [agentData, agentId]);
	}

	static async delete(agentId) {
		const query = `DELETE FROM call_agents WHERE agent_id = ?`;
		return db.query(query, [agentId]);
	}

	static async toggleActive(agentId, isActive) {
		const query = `UPDATE call_agents SET is_active = ? WHERE agent_id = ?`;
		return db.query(query, [isActive, agentId]);
	}
}

module.exports = CallAgent;